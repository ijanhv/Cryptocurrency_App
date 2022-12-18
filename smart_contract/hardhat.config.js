// https://eth-goerli.g.alchemy.com/v2/cIJE6PSKNGv7zaoqyHPDKcybu0lONoHc

require('@nomiclabs/hardhat-waffle')

module.exports = {
    solidity: '0.8.0',
    networks: {
        goerli: {
            url: 'https://eth-goerli.g.alchemy.com/v2/cIJE6PSKNGv7zaoqyHPDKcybu0lONoHc',
            accounts: ['ab79190fe2523a49bcbffce24af047bccb72f64676c6a0f0b457dbbf4e30cdb6' ]
        }
    }
}