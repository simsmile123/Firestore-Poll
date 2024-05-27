// src/Poll.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const Page = () => {
  const [question] = useState("What is your favorite programming language?");
  const [newOption, setNewOption] = useState('');
  const [responses, setResponses] = useState([]);

  const fetchResponses = async () => {
    const querySnapshot = await getDocs(collection(db, 'responses'));
    const responsesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    responsesArray.sort((a, b) => b.upvotes - a.upvotes);
    setResponses(responsesArray);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleAddOption = async () => {
    if (newOption.trim()) {
      await addDoc(collection(db, 'responses'), { option: newOption, upvotes: 0 });
      setNewOption('');
      fetchResponses();
    }
  };

  const handleUpvote = async (id, currentUpvotes) => {
    const responseDoc = doc(db, 'responses', id);
    await updateDoc(responseDoc, { upvotes: currentUpvotes + 1 });
    fetchResponses();
  };

  return (
    <div>
      <h1>{question}</h1>
      <input
        type="text"
        value={newOption}
        onChange={(e) => setNewOption(e.target.value)}
        placeholder="Add your option"
      />
      <button onClick={handleAddOption}>Submit</button>
      <ul>
        {responses.map(response => (
          <li key={response.id}>
            {response.option} - {response.upvotes} votes
            <button onClick={() => handleUpvote(response.id, response.upvotes)}>Upvote</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
