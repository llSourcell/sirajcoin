## Validator instructions

Running a validator is a huge responsibility. You need to know how to keep a server online with 100% uptime in a hostile environment. If that sounds scary, please let us know ASAP -- you don't have to do this!

## 0. Generate a validator key pair

If you're reading this guide, you've already given us your validator pub key. Skipping this section for now.

## 1. Spin up a linux server

We recommend Digital Ocean on Ubuntu 16.04.3, but use whatever you want.

SSH into your server, then grab your ip:

```bash
$ curl ipinfo.io/ip
```

then tell us your ip in slack.

## 2. Install Node

We're gonna install the latest stable release of Node.js:

```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
$ export NVM_DIR="$HOME/.nvm"
$ [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
$ nvm install stable
```

and check that it worked with:

```bash
$ node -v
```

## 3. Set up validator home directory

```bash
$ mkdir ~/validator
$ cd ~/validator
```

Remember `privkey.json` from step 0? Put its contents in `~/validator/privkey.json`.

## 5. Install Sirajcoin on the server

```bash
$ sudo apt install build-essential python
$ npm i -g sirajcoin
```

## 6. Run your validator

From inside `~/validator`, run:

```bash
$ sirajcoin-node
```

Woo, you're validating the Sirajcoin network and getting paid Sirajcoin for it! Now keep it online.
