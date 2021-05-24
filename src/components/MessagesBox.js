import React, { useEffect, useRef } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";

import { Container } from "react-bootstrap";
import Message from "./Message";
import NewMessage from "./NewMessage";
import ChatroomList from "./ChatroomList";

const MessagesBox = () => {
	const ref = useRef();

	const [value, loading, error] = useCollection(
		firebase
			.firestore()
			.collection("chatrooms")
			.doc("roomA")
			.collection("messages")
			.orderBy("timestamp", "asc")
			.limitToLast(15),
		{ snapshotListenOptions: { includeMetadataChanges: true } }
	);

	useEffect(() => {
		ref.current && ref.current.scrollIntoView({ behavior: "smooth" });
	}, [value]);

	return (
		<Container className="chatroom-container">
			<Container className="chatroom-list-container">
				<ChatroomList />
			</Container>
			<Container className="messages-box">
				<Container className="messages-container">
					{error && <strong>Error: {JSON.stringify(error)}</strong>}
					{loading && <span>Loading...</span>}
					{value && (
						<>
							{value.docs.map((message) => (
								<Message
									key={message.id}
									text={message.data().text}
									userAvatar={message.data().profilePicUrl}
									uid={message.data().uid}
								/>
							))}
							<span ref={ref}></span>
						</>
					)}
				</Container>
				<Container className="new-message-container">
					<NewMessage />
				</Container>
			</Container>
		</Container>
	);
};

export default MessagesBox;