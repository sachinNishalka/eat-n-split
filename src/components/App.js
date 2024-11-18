import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriedForm, setAddFriendForm] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=");
  const [friendList, setFriendList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSetSelectedFriend(friend) {
    setSelectedFriend(friend);
    setAddFriendForm(false);
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    let id = crypto.randomUUID();
    let newFriend = {
      id,
      name,
      image: `${image}${id}`,
      balance: 0,
    };
    setFriendList((friendList) => [...friendList, newFriend]);
    setName("");
    setImage("https://i.pravatar.cc/48?u=");
    setAddFriendForm(false);
  }

  function handleShowAddFriendForm() {
    setAddFriendForm((show) => !show);
  }

  function handleSplitBill(value) {
    console.log(value);

    setFriendList((friendList) =>
      friendList.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friendList={friendList}
          onHandleSelectedFriend={handleSetSelectedFriend}
          selectedFriend={selectedFriend}
        ></FriendList>
        {showAddFriedForm && (
          <AddFriendForm
            name={name}
            image={image}
            onSetName={setName}
            onSetImage={setImage}
            onHandleOnSubmit={handleOnSubmit}
          ></AddFriendForm>
        )}
        <Button onClick={handleShowAddFriendForm}>
          {showAddFriedForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSpitBill
          selectedFriend={selectedFriend}
          onHandleSplitBill={handleSplitBill}
          key={selectedFriend.id}
        ></FormSpitBill>
      )}
    </div>
  );
}

function FriendList({ friendList, onHandleSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friendList.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onHandleSelectedFriend={onHandleSelectedFriend}
          selectedFriend={selectedFriend}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onHandleSelectedFriend, selectedFriend }) {
  let selected = friend?.id === selectedFriend?.id;
  return (
    <li className={selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button
        onClick={
          selected
            ? () => onHandleSelectedFriend(null)
            : () => onHandleSelectedFriend(friend)
        }
      >
        {selected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function AddFriendForm({
  name,
  image,
  onSetImage,
  onSetName,
  onHandleOnSubmit,
}) {
  return (
    <form className="form-add-friend" onSubmit={onHandleOnSubmit}>
      <label>👲 Name</label>
      <input
        type="text"
        onChange={(e) => onSetName(e.target.value)}
        value={name}
      ></input>
      <label>📷 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => onSetImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSpitBill({ selectedFriend, onHandleSplitBill }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const friendsExpense = bill - myExpense;

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !myExpense) return;
    whoIsPaying === "user"
      ? onHandleSplitBill(friendsExpense)
      : onHandleSplitBill(-myExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>👱‍♂️ Your Expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          setMyExpense(
            bill > Number(e.target.value)
              ? Number(e.target.value)
              : Number(bill)
          )
        }
      ></input>
      <label>👲 {selectedFriend.name}`s` Expense</label>
      <input type="text" value={friendsExpense} disabled></input>
      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <Button>Pay Bill</Button>
    </form>
  );
}

export default App;
