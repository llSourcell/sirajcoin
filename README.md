# Sirajcoin

Hello world, it's Sirajcoin!

Sirajcoin is an experiment with two goals:

- add rocket fuel to the growth of our community
- fund AI research in a decentralized way!

Note: this is still very experimental code, and it may be insecure. *Please do not pay real money for Sirajcoin.*

## Installing the Sirajcoin wallet

To send and receive Sirajcoin, you'll need a mac or linux machine and **Node.js version 8** or later.

Windows support should come soon. If you'd like to help with that, many Windows users would appreciate a pull request!

Then in your terminal, run:

```bash
npm i -g sirajcoin
```

If you're having trouble installing, try installing it locally:

```bash
mkdir -p ~/.sirajcoin && \
cd ~/.sirajcoin && \
echo {} > package.json && \
npm i sirajcoin && \
export PATH=$PATH:$PWD/node_modules/.bin
```

If you're on Windows and want to use Sirajcoin, consider spinning up a [Digital Ocean](https://digitalocean.com) droplet and using the wallet via SSH.

## Setting up everything from a newly installed ubuntu 17.10

Download latest ubuntu, after it has been installed 
run the following commands in order:

```
sudo apt-get update
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs
npm install graceful-fs
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
gedit ~/.profile
```
Add following line at the end in .profile file
```
export PATH=~/.npm-global/bin:$PATH
```
Save and close .profile file

```
source ~/.profile
sudo apt-get install build-essential
npm i -g sirajcoin
sirajcoin balance
sirajcoin balance
```

The double sirajcoin balance is due to a bug, will be fixed!

## Getting your first Sirajcoin

First, you'll need to generate a Sirajcoin address.

After you've installed the wallet, you can see your address by running:

```bash
$ sirajcoin balance
```

To get your first Sirajcoin, simply [subscribe] to the YouTube channel, then post a comment containing your Sirajcoin address on [this video], and the Sirajcoin YouTube [oracle] will automagically grant you 10 Sirajcoin if you've subscribed.

## Sending Sirajcoin

To send Sirajcoin to someone, run:

```bash
$ sirajcoin send <recipient_address> <amount>
```

## How it works

In short, Sirajcoin is a [proof-of-stake] cryptocurrency built on top of [Tendermint consensus] using a library called [Lotion], secured by a hand-picked set of community validators.

You can learn more about the technical details and economic design of Sirajcoin in the [Sirajcoin whitepaper].

## Credits

Sirajcoin is developed by:

- [Siraj Raval](https://github.com/llsourcell)
- [Matt Bell](https://github.com/mappum)
- [Chad Lohrli](https://github.com/chadlohrli)
- [Judd Keppel](https://github.com/keppel)

and you are encouraged to contribute ideas or pull requests!

## License

MIT

[proof-of-stake]: https://en.wikipedia.org/wiki/Proof-of-stake
[Tendermint consensus]: https://tendermint.readthedocs.io/en/master/introduction.html
[Lotion]: https://github.com/keppel/lotion

[subscribe]: https://www.youtube.com/channel/UCWN3xxRkmTPmbKwht9FuE5A
[this video]: https://www.youtube.com/watch?v=X9QqQ2EmD9o
[oracle]: https://blockchainhub.net/blockchain-oracles/
[Sirajcoin whitepaper]: https://sirajcoin.io/whitepaper
