import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDX8UYw24urpAWZcVhPtyRKWAF7THxMyNE",
  authDomain: "meet-your-soul.firebaseapp.com",
  projectId: "meet-your-soul",
  storageBucket: "meet-your-soul.appspot.com",
  messagingSenderId: "827720584875",
  appId: "1:827720584875:web:0c952660247caf962db1ee"
};

export const app = initializeApp(firebaseConfig);