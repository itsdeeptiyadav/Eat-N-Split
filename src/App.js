import { useState } from "react";
import "./index.css";

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

export default function App() {
  const [friends, setfriends] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [item, setItem] = useState(initialFriends);

  function handleOpen() {
    // console.log(friends);
    setfriends((is) => !is);
  }

  function handleSelectedFriend(friend) {
    console.log(friend);
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setfriends(false);
  }

  function handleAddItem(values) {
    console.log(item);
    setItem((item) => [...item, values]);
    setfriends(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setItem((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          item={item}
          selectedFriend={selectedFriend}
          onSelection={handleSelectedFriend}
        />
        {friends && <FormAddFriend onAddItems={handleAddItem} />}
        {friends ? (
          <Button onClick={handleOpen}>close</Button>
        ) : (
          <Button onClick={handleOpen}>Add friend</Button>
        )}
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ item, onSelection, selectedFriend }) {
  return (
    <ul>
      {item.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  
  const isSelected = selectedFriend?.id === friend.id;
  
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you ${friend.balance}.
        </p>
      ) : friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} ${-friend.balance}.
        </p>
      ) : (
        <p>You and {friend.name} are even.</p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddItems }) {
  const [values, setValues] = useState({
    id: crypto.randomUUID,
    name: "",
    image: "",
    balance: 0,
  });

  const { name, image } = values;

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    onAddItems(values);

    setValues({
      name: "",
      image: "",
    });
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name </label>
      <input
        type="text"
        value={name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Friend name"
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => handleChange("image", e.target.value)}
        placeholder="Image"
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [split, setSplit] = useState({
    bill: "",
    paidByUser: "",
    whoIsPayer: "user",
  });

  const { bill, paidByUser, whoIsPayer } = split;

  function handleSplitChange(key, value) {
    setSplit((prev) => ({ ...prev, [key]: value }));
  }

  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSplitSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPayer ==="user"?paidByFriend:-paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplitSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => handleSplitChange("bill", Number(e.target.value))}
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          handleSplitChange(
            "paidByUser",
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👫{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill?</label>
      <select
        name=""
        id=""
        value={whoIsPayer}
        onChange={(e) => handleSplitChange("whoIsPayer", e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
