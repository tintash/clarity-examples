import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrIhqXBHXQ29IxWWUl5omleF4Y4umqFIY",
  authDomain: "velocity-nft.firebaseapp.com",
  databaseURL: "https://velocity-nft.firebaseio.com",
  storageBucket: "velocity-nft.appspot.com",
};
const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

function LoadImage(props) {
  const tokenId = props.tokenId;
  getDownloadURL(ref(storage, `NFT/${tokenId}.png`))
    .then((url) => {
      const img = document.getElementById("myimg" + tokenId);
      img.setAttribute("src", url);
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <div>
      <img
        id={"myimg" + tokenId}
        alt="https://firebasestorage.googleapis.com/v0/b/velocity-nft.appspot.com/o/1.png?alt=media&token=bf0473d6-8151-49b4-b509-bd69bd9bb690"
      />
    </div>
  );
}

export default LoadImage;
