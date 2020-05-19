import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class MyHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        print("TYPE:[" + event.event_type + "] TIME:[" + time.ctime() + "] DIR:[" + event.src_path + "]")
        if not event.is_directory:
            compile = os.system("lessc " + event.src_path + " ../" + event.src_path.split("/")[::-1][0].split('.')[0]+".css")

if __name__ == "__main__":
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path='../less/', recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
