import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Posts from "./Posts";
import styled from "styled-components";
import { useNavigate } from "react-router";
import DropdownButton from "react-bootstrap/DropdownButton";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import LikePost from "./LikePost";
import AddComment from "./AddComment";
import DeleteComment from "./DeleteComment";
import { makeVar, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import queries from "../queries";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Link,
} from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function Search(props) {
  const [value, setValue] = React.useState(0);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const searchTerm = props.searchTerm != null;

  const { data, loading, error } = useQuery(queries.post.GET_BY_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      queryFields: {
        search: searchTerm,
      },
    },
  });
  const {
    dataUsers,
    loadingUsers,
    errorUsers,
    refetch: refetchUsers,
  } = useQuery(queries.user.GET_BY_NAME, {
    fetchPolicy: "cache-and-network",
    variables: {
      username: searchTerm,
    },
  });

  console.log(`Error: ${error}`);

  // async function fetchPosts() {
  //   try {
  //     const response = await getPostsBySearch();
  //     const data = response.data;
  //     if (data && data.getByQuery) {
  //       setPosts(data.getByQuery);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function fetchUsers() {
  //   try {
  //     const { data } = await getUsersByName();
  //     if (data && data.getByName) {
  //       setUsers(data.getByName);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   refetch({
  //     refetchWritePolicy: "overwrite",
  //     nextFetchPolicy: "network-only",
  //     fetchPolicy: "network-only",
  //     variables: {
  //       queryFields: {
  //         search: searchTerm,
  //       },
  //     },
  //   });
  //   refetchUsers({
  //     fetchPolicy: "network-only",
  //     nextFetchPolicy: "network-only",
  //     refetchWritePolicy: "overwrite",
  //     variables: {
  //       username: searchTerm,
  //     },
  //   });
  // }, [props.searchTerm]);

  const [addFriend] = useMutation(queries.user.ADD_FRIEND);
  const [removeFriend] = useMutation(queries.user.REMOVE_FRIEND);

  const setBody = (type) => {
    props.setCurrentBody(type);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function handleAddFriend(friendId, e) {
    e.preventDefault();
    // try {
    //   const { data } = await addFriend({
    //     variables: {
    //       friendId: friendId,
    //     },
    //   });
    //   newlyAdded.push(friendId);
    //   const newRecommendations = recommendations.map((user) => {
    //     if (user._id.toString() == friendId) {
    //       return data.addFriend;
    //     }
    //     return user;
    //   });
    //   if (newlyAdded.length == 4) {
    //     Swal.fire({
    //       icon: "success",
    //       title: "Congratulations",
    //       text: "You have made some new friends",
    //       confirmButtonText: "Go to feed",
    //     }).then(() => {
    //       navigate("/main");
    //       // window.location.reload();
    //       setBody("feed");
    //     });
    //   }
    //   setRecommendations(newRecommendations);
    // } catch (e) {
    //   console.log(e);
    // }
  }

  async function handleRemoveFriend(friendId, e) {
    e.preventDefault();
    // try {
    //   const { data } = await removeFriend({
    //     variables: {
    //       friendId: friendId,
    //     },
    //   });
    //   newlyAdded.splice(newlyAdded.indexOf(friendId), 1);
    //   const newRecommendations = recommendations.map((user) => {
    //     if (user._id.toString() == friendId) {
    //       return data.deleteFriend;
    //     }
    //     return user;
    //   });
    //   setRecommendations(newRecommendations);
    // } catch (e) {
    //   console.log(e);
    // }
  }

  console.log("dataUsers");
  console.log(dataUsers);

  return (
    <div
      style={{
        marginTop: "5%",
        flex: "0.6",
        flexGrow: "1",
      }}
    >
      <Typography variant="h6" component="h6">
        Showing search result for {searchTerm}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Posts" {...a11yProps(0)} />
          <Tab label="Users" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PostDiv>
          <div className="displayContainer">
            {data &&
              data.getByQuery &&
              data.getByQuery.map((post) => {
                let days = Math.floor(
                  (new Date() - new Date(post.dateCreated)) / (1000 * 3600 * 24)
                );
                return (
                  <div className="container mt-5 mb-5" key={post._id}>
                    <div className="row d-flex align-items-center justify-content-center">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="d-flex justify-content-between p-2 px-3">
                            <div className="d-flex flex-row align-items-center">
                              {" "}
                              <img
                                src={post.user.profilePicture}
                                width="50"
                                className="rounded-circle"
                                alt={post.user.userName}
                                onClick={() => {
                                  setBody("user");
                                  {
                                    userId === post.user._id &&
                                      navigate("/profile", {
                                        state: {
                                          prevLocation:
                                            window.location.pathname,
                                          prevElement: props.currentBody,
                                        },
                                      });
                                  }
                                  {
                                    userId !== post.user._id &&
                                      navigate(`/user/${post.user._id}`, {
                                        state: {
                                          prevLocation:
                                            window.location.pathname,
                                          prevElement: props.currentBody,
                                        },
                                      });
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              />
                              <div className="d-flex flex-column ml-2">
                                {" "}
                                <span
                                  className="font-weight-bold"
                                  onClick={() => {
                                    setBody("user");
                                    {
                                      userId === post.user._id &&
                                        navigate("/profile", {
                                          state: {
                                            prevLocation:
                                              window.location.pathname,
                                            prevElement: props.currentBody,
                                          },
                                        });
                                    }
                                    {
                                      userId !== post.user._id &&
                                        navigate(`/user/${post.user._id}`, {
                                          state: {
                                            prevLocation:
                                              window.location.pathname,
                                            prevElement: props.currentBody,
                                          },
                                        });
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {post.user.name}
                                </span>{" "}
                                <small className="text-primary catText">
                                  {post.category}
                                </small>{" "}
                              </div>
                            </div>
                            <div className="d-flex flex-row mt-1 ellipsis">
                              {" "}
                              {days === 0 && (
                                <small className="mr-2">Today</small>
                              )}
                              {days === 1 && (
                                <small className="mr-2">1 day ago</small>
                              )}
                              {days > 1 && (
                                <small className="mr-2">{days} days ago</small>
                              )}
                              {userId === post.user._id && (
                                <div>
                                  <DropdownButton
                                    id="dropdown-basic-button"
                                    variant="default"
                                    size="sm"
                                    title={
                                      <span>
                                        <i className="fa fa-ellipsis-h"></i>
                                      </span>
                                    }
                                  >
                                    <EditPost post={post} />
                                    <DeletePost postId={post._id} />
                                  </DropdownButton>
                                </div>
                              )}
                            </div>
                          </div>{" "}
                          {post.image && (
                            <img
                              src={post.image}
                              className="img-fluid"
                              alt={post.text}
                            ></img>
                          )}
                          <div className="p-2">
                            <p className="text-justify">{post.text}</p>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex flex-row icons d-flex align-items-center">
                                {" "}
                                <LikePost
                                  likes={post.likes}
                                  postId={post._id}
                                />
                                <small className="likeCount muted-color">
                                  {post.likes.length}
                                </small>
                              </div>
                              <div className="d-flex flex-row muted-color">
                                {" "}
                                {post.comments.length !== 1 && (
                                  <span>
                                    {`${post.comments.length}`} comments
                                  </span>
                                )}
                                {post.comments.length === 1 && (
                                  <span>1 comment</span>
                                )}
                              </div>
                            </div>
                            <hr />
                            <div className="comments">
                              {post.comments.length > 0 &&
                                post.comments.map((comment) => {
                                  return (
                                    <div
                                      className="d-flex flex-row mb-2"
                                      key={comment._id}
                                      style={{ width: "100%" }}
                                    >
                                      <img
                                        src={comment.user.profilePicture}
                                        width="40"
                                        className="rounded-image"
                                        alt={comment.user.userName}
                                        onClick={() => {
                                          setBody("user");
                                          navigate(`/user/${post.user._id}`, {
                                            state: {
                                              prevLocation:
                                                window.location.pathname,
                                              prevElement: props.currentBody,
                                            },
                                          });
                                        }}
                                        style={{ cursor: "pointer" }}
                                      />
                                      <div className="d-flex flex-column ml-2">
                                        {" "}
                                        <span
                                          className="name"
                                          onClick={() => {
                                            setBody("user");
                                            navigate(
                                              `/user/${comment.user._id}`,
                                              {
                                                state: {
                                                  prevLocation:
                                                    window.location.pathname,
                                                  prevElement:
                                                    props.currentBody,
                                                },
                                              }
                                            );
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            textAlign: "left",
                                          }}
                                        >
                                          {comment.user.name}
                                        </span>{" "}
                                        <small className="comment-text">
                                          {comment.comment}
                                        </small>
                                        <div className="d-flex flex-row align-items-center status">
                                          {" "}
                                        </div>
                                      </div>
                                      <div style={{ flex: "1" }}>
                                        {userId === comment.user._id && (
                                          <DeleteComment commId={comment._id} />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              <AddComment postId={post._id} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </PostDiv>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PostDiv>
          <Grid
            container
            spacing={3}
            style={{ marginTop: "0px", padding: "1% 5%" }}
          >
            {dataUsers &&
              dataUsers.getByName &&
              dataUsers.getByName.map((user) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                    <Card style={{ borderRadius: "7px", height: "57vh" }}>
                      <Link
                        to={`/user/${user._id}`}
                        style={{ textDecoration: "none", color: "#dc3545" }}
                      >
                        <CardMedia
                          component="img"
                          style={{ height: "30vh" }}
                          image={user.profilePicture}
                          alt={user.name}
                        />
                        <CardContent>
                          <Typography
                            style={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 1,
                            }}
                            gutterBottom
                            variant="h5"
                            component="div"
                          >
                            {user.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            style={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 3,
                            }}
                          >
                            {user.bio}
                          </Typography>
                        </CardContent>
                        <CardActions style={{ justifyContent: "center" }}>
                          {userId != user._id &&
                            !user.friends.includes(userId) && (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                  handleAddFriend(user._id, e);
                                }}
                              >
                                + Add friend
                              </Button>
                            )}
                          {userId != user._id && user.friends.includes(userId) && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={(e) => {
                                handleRemoveFriend(user._id, e);
                              }}
                            >
                              - Unfriend
                            </Button>
                          )}
                        </CardActions>
                      </Link>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </PostDiv>
      </TabPanel>
    </div>
  );
}

const PostDiv = styled.div`
  overflow-y: scroll;
`;
