import React, { useEffect, useState} from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

// window.ethereum

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    // console.log({
    //     provider,
    //     signer,
    //     transactionsContract
    // })

    return transactionsContract;
}

export const TransactionProvider = ({ children }) => {

    const [ formData, setFormData ] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [ currentAccount, setCurrentAccount ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false);
    const [ transactionCount, setTransactionCount ] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}))
    }


const checkIfWalletIsConnected = async () => {
    try {
         if(!ethereum) return alert("Please install metamask")

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        console.log(accounts)

        if(accounts.length) {
            setCurrentAccount(accounts[0]);

            //getAllTransactions
        } else {
            console.log("No accounts found")
        }
    } catch (error) {
        console.log(error);

        throw new Error("No Ethereum Object")
    }

       
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch(error) {
            console.log(error);

            throw new Error("No Ethereum Object")
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask")

            //get the data from the form
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 2100 Gwei
                    value: parsedAmount._hex //0.0001
                }] 
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword,);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait()
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);
            
            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object")
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}