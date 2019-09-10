import Find_and_install_the_MetaMask from 'raw-loader!@/data/DecisionTree/md/Find_and_install_the_MetaMask.md';
import MyEtherWallet_An_Introduction from 'raw-loader!@/data/DecisionTree/md/MyEtherWallet_An_Introduction.md';

export default {
  /*
  =====================================================================================
  ROOT
  =====================================================================================
  */
  ROOT: {
    title: 'Have a question?',
    sub: [
      'Back_to_the_Basics_10_Tips_for_Beginners',
      'Does_MEW_Support_BTC_or_other_Coins',
      'How_to_Access_Your_Wallet',
      'How_to_Create_a_Wallet'
    ]
  },

  /*
  =====================================================================================
  How to create new wallet
  =====================================================================================
  */
  Good_to_be_home: {
    title: 'Good to be home',
    sub: ['Do_you_have_a_dog', 'My_name_is_Great_man']
  },
  Back_to_the_Basics_10_Tips_for_Beginners: {
    title: 'Back to the Basics: 10 Tips for Beginners',
    sub: ['Good_to_be_home']
  },
  Does_MEW_Support_BTC_or_other_Coins: {
    title: 'Does MEW Support BTC or other Coins?',
    md: MyEtherWallet_An_Introduction
  },
  Are_we_going_to_be_okay: {
    title: 'Are you going to be okay?',
    md: MyEtherWallet_An_Introduction
  },
  Do_you_have_a_dog: {
    title: 'Do you have a dog?',
    md: MyEtherWallet_An_Introduction
  },
  My_name_is_Great_man: {
    title: 'My name is Great man?',
    md: Find_and_install_the_MetaMask
  },

  /*
  =====================================================================================
  How to access wallet
  =====================================================================================
  */
  How_to_Access_Your_Wallet: {
    title: 'How to Access Your Wallet',
    sub: ['How_to_Create_a_Wallet', 'Does_MEW_Support_BTC_or_other_Coins']
  },
  How_to_Create_a_Wallet: {
    title: 'How to Create a Wallet',
    md: MyEtherWallet_An_Introduction
  }
};
