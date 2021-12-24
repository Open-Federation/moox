BIN=node_modules/.bin

build:
	$(BIN)/babel src/*.ts --out-dir lib

clean:
	rm -rf lib
