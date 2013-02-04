######################################################
#config
######################################################
TSC = tsc
NODE = node
NPM = npm
COMPILE = $(TSC) --sourcemap --target ES5
EXEC = $(NODE)

#make target
TARGET = app.js
SRCDIR = .
OUTFILES = \
	proxy.js \
	io_irc.js \
	app.js


######################################################
#make
######################################################

.SUFFIXES: .ts .js

exec: $(OUTFILES)
	$(EXEC) $(SRCDIR)/$(TARGET)

.ts.js:
	$(COMPILE) $(SRCDIR)/$<

clean:
	-rm $(OUTFILES) *.js.map

setup:
	$(NPM) install irc

