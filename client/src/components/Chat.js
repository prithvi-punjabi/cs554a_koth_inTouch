import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";
import queries from "../queries";
const styles = {
  largeIcon: {
    width: 40,
    height: 32,
  },
  largerIcon: {
    width: 50,
    height: 50,
  },
};

function Chat(props) {

  const messageRef = useRef(null)
  const textBox = useRef(null);
  console.log(props);
  const [currentChannel, setCurrentChannel] = useState(props.currentChannel);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({
      behavior:"smooth"
      
    })
}, [props,currentChannel])
  //   const { data, loading, error } = useSubscription(
  //     queries.channel.SUBSCRIBE_MESSAGE,
  //     {
  //       variables: {
  //         channelId: props.currentChannel._id,
  //       },
  //     }
  //   );

  useEffect(() => {
    setCurrentChannel(props.currentChannel);
  }, [props]);

  

  //   if (data) {
  //     console.log(data);
  //   }
  //   if (error) {
  //     console.log(error);
  //   }

  //REFRESHING CHANNEL ON NEW MESSAGE
  //   useEffect(() => {
  //     if (data) setCurrentChannel(data.channel);
  //   }, [data]);

  //SENDING MESSAGE
  const [addMessage] = useMutation(queries.channel.ADD_MESSAGE);

  //POPULATOR FUNCTIONS
  const mapper = (chat) => {
    // console.log(chat);
    return chat.map((message) => {
      
      
        let days = Math.floor(
          (new Date() - new Date(message.dateCreated)) / (1000 * 3600 * 24)
          )
        let date = new Date(message.dateCreated)
        let time = date.toTimeString()
        let dateTime = date.toLocaleString()

        let h =  date.getHours(), m = date.getMinutes();
        time = (h > 12) ? (h-12 + ':' + m +' PM') : (h + ':' + m +' AM');

        date = date.toDateString()
  

      return (
        
        <ChannelMessagesContainer key={message._id}>
       
       
          <img src={message.user.profilePicture}></img>
          
            <MessageInfo>
            <h5>{message.user.userName}<span>{" "}
                          {days === 0 && (<small className="mr-2">Today, {time}</small>)}
                          {days === 1 && (
                            <small className="mr-2">Yesterday, {time}</small>
                          )}
                          {days > 1 && (
                            <small className="mr-2">{date}, {time}</small>
                          )}</span></h5>
            
            <MessageDetail>
            <p>{message.message}</p>
            </MessageDetail>
            </MessageInfo>
            
          
        </ChannelMessagesContainer>
       

        
      
        
      );
    });
  };

  let chat =
    currentChannel &&
    currentChannel.messages &&
    mapper(currentChannel.messages);
  return (
    <ChannelContainer>
      <Header>
        <HeaderLeft>
          <StarBorderIcon style={styles.largeIcon} />
          <h4>
            <strong>{currentChannel.name}</strong>
          </h4>
        </HeaderLeft>
        <HeaderRight>
          <p>
            <InfoOutlinedIcon style={styles.largeIcon} />
            Details
          </p>
        </HeaderRight>
      </Header>

      <ChannelMessages>
       
        {chat}
        <MessageBottom ref={messageRef} />
        </ChannelMessages>

      <ChannelInput>
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            addMessage({
              variables: {
                channelId: currentChannel._id,
                user: props.user,
                message: textBox.current.value,
              },
            });
            textBox.current.value = "";
          }}
        >
          <input
            placeholder={`Send text in ${currentChannel.name}`}
            ref={textBox}
          />
          <div>
           
            <Button  type="submit"> <SendIcon style={styles.largerIcon} /></Button>
          </div>
        </form>
      </ChannelInput>
    </ChannelContainer>
  );
}

export default Chat;

const MessageBottom = styled.div`
padding-bottom: 100px;
`

const ChannelMessagesContainer = styled.div`
display: flex;
/* align-items: center; */

padding: 10px;
background-color: #ffffff;
border: 1px solid lightgray;
border-radius: 20px;
margin-bottom: 10px;
>img {
  height: 60px;
  border-radius: 8px;
}

`

const MessageInfo = styled.div`
padding-left:10px ;
align-items: left;
text-align: left;
>h5>span{
  color:gray;
  font-weight: 300;
  margin-left: 14px;
  font-size: 14px;
}

p>{
 
}
`
const MessageDetail = styled.div`
float: left;
`
const ChannelMessages = styled.div`
padding: 5px;
margin-top: 110px;
/* display: flex; */
/* text-align: left; */

`
const ChannelInput = styled.div`
  border-radius: 20px;

  > form {
    position: relative;
    display: flex;
    justify-content: center;
  }
  > form > input {
    position: fixed;
    bottom: 30px;
    width: 60%;
    border: 1px solid black;
    border-radius: 3px;
    padding: 20px;
    outline: none;
  }
  > form > div {
    position: fixed;
    bottom: 30px;

    /* margin-left: 1085px; */
    margin-left: 56.5%;
    /* border-radius: 2px; */
    padding: 0.1%;
    outline: none;
  }

  
  /* >form>div >button {
    position: fixed;
    bottom: 30px;

    
    border: 1px solid black;
    border-radius: 3px;
    padding: 1.25%;
    outline: none;
    
} */
`;

const HeaderLeft = styled.div`
position: fixed;
  display: flex;
  
  > h4 {
    display: flex;
    /* margin-left: 10px; */
  }
  /* >h4 >.MuiSvgIcon-root{
    margin-left: 5%;
    font-size: 30px;
    width: 50;
    height: 50;
} */
`;
const HeaderRight = styled.div`
  display: flex;
  position: fixed; 

  align-items: right;
  margin-left: 75%;
  margin-right: 20px;
  > p {
    display: flex;
    align-items: center;
    font-size: 20px;
  }
`;

const Header = styled.div`
 
 display: flex;
  position: fixed;
  width: 100%;
  justify-content: space-between;
  padding: 50px;
  border-bottom: 1px solid lightgray;
  background-color: white;
`;

const ChannelContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 49px;
`;
