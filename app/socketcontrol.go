package main

import (
	"bufio"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"os"
	"os/signal"
	"strings"
	"syscall"
)

type Message struct {
	Action *string `json:"action"`
	Url    *string `json:"url"`
}

const SockAddr = "/tmp/firefox.sock"

func serve(c net.Conn) {
	defer c.Close()
	tmp := make([]byte, 1024)
	data := make([]byte, 0)
	for {
		n, err := c.Read(tmp)
		if err != nil {
			if err != io.EOF {
				return
			}
			break
		}
		data = append(data, tmp[:n]...)
	}
	parse(string(data))
}

func send(action *string, url *string) {
	msg := Message{
		Action: action,
		Url:    url,
	}
	bytes, _ := json.Marshal(msg)
	ba := make([]byte, 4)
	binary.LittleEndian.PutUint32(ba, uint32(len(bytes)))
	fmt.Print(string(ba))
	fmt.Print(string(bytes))
}

func parse(data string) {
	args := strings.Split(data, "|")
	action := args[0]
	urls := args[1:]
	if len(urls) == 0 {
		send(&action, nil)
	} else {
		for _, url := range urls {
			send(&action, &url)
		}
	}
}

func main() {

	if err := os.RemoveAll(SockAddr); err != nil {
		os.Exit(1)
	}

	l, err := net.Listen("unix", SockAddr)
	if err != nil {
		os.Exit(2)
	}

	defer l.Close()

	go func() {
		for {
			conn, err := l.Accept()
			if err != nil {
				break
			}
			go serve(conn)
		}
	}()

	done := make(chan bool, 1)

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		done <- true
	}()

	go func() {
		reader := bufio.NewReader(os.Stdin)
		reader.ReadString('\n')
		done <- true
	}()

	<-done
}
