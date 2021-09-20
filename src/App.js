import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload'
import {db,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const classes=useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts]= useState([]);
  const [open,setOpen]=useState(false);
  const [opensignIn,setOpenSignIn] = useState(false);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const [user,setUser] = useState(null);


  // Runs a piece of code based on a specific condition ( USEEFFECT ) like when a user comments

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        //user logged in...
        console.log(authUser);
        setUser(authUser);

    
      }
      else {
        
        //user not loggin in...
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

  },[user,username]);


  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //everytime a new post is added, this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  },[]);

const signUp=((event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
       return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=> alert(error.message));
});

const signIn=((event) => {
  event.preventDefault();
  
  auth
  .signInWithEmailAndPassword(email,password)
  .catch((error) => alert(error.message))

  setOpenSignIn(false);
})





 

  return (
    <div className="App">

      {/* I want to have caption input, file picker, post button */}
      

      

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
              <center>
              <img 
                  src="https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814048_960_720.png" 
                  alt="instagram" 
                  className="app_headerimage"/>
              </center>
              <Input 
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input 
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
                <Input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>


          

          
        </div>

      </Modal>

      <Modal
        open={opensignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
              <center>
              <img 
                  src="https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814048_960_720.png" 
                  alt="instagram" 
                  className="app_headerimage"/>
              </center>

              <Input 
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
                <Input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>


          

          
        </div>

      </Modal>
       <div className="app__header">
         <img src="https://cdn.pixabay.com/photo/2018/11/13/21/43/instagram-3814048_960_720.png" alt="instagram" className="app_headerimage"/>
         
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) :

          (
            <div className="app__loginContainer">

              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign up</Button>
            </div>
          )}
       </div>

       
       <div className="app__posts">
        <div className="app__postsLeft">
       {
          posts.map(({id,post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} ImageUrl={post.ImageUrl}/>
          ))
        }
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CCmBOMmB0fN/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          /> 
        </div>
      </div>


      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ): (
        <h3>Login to Upload</h3>
      )}

       
    </div>
  );
}

export default App;
