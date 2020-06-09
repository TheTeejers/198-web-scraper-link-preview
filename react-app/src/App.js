import React, { useState } from 'react';
import './App.css';

const variableName = 'variableValue';

function App() {

  return (
    <div className="App">
      <LinkPreview />
    </div>
  );
}

// module.exports = variableName



function LinkPreview() {

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false); 
  const [links, setLinks] = useState([]);
  const [password, setPassword] = useState('');
  const [racerName, setRacerName] = useState('');

  var creds = {}
  creds.text = text
  creds.password = password

  const handleSubmit = async(evt) => {
    setLoading(true)
    evt.preventDefault();
    console.log(`Submitting ${text}`);

    const res = await fetch('http://localhost:5000/k1data/us-central1/scraper', {
        method: 'POST',
        body: JSON.stringify({creds}),
        // username: JSON.stringify({racerName})
    });

    const data = await res.json();
    setRacerName(data[0].nameData)
    console.log(data)
    console.log(racerName);

    setLinks(data);
    setLoading(false)
  }



  return (
    <div>
      <h1>Form</h1>
      {/* Try this: <pre>a post with some links https://fireship.io and https://fireship.io/courses/javascript/</pre> */}

      <form onSubmit={handleSubmit}>
        <input rows="1" cols="50"
          placeholder="Racer ID"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}>

        </input>
        <input rows="1" cols="50"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}>

        </input>
        <br />
        <input type="submit" value="Submit" />
        </form>

        <h2>Racer  {racerName}</h2>

        {loading &&  <h3>Fetching racer data...</h3> }

        <table>
          <tbody>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Race Number</th>
              <th>Race Type</th>
              <th>Kart Number</th>
              <th>Position</th>
              <th>BestTime</th>
            </tr>
          </tbody>
        </table>
        { links.map(obj => <PreviewCard key={obj.raceNumber} linkData={obj} />) }


    </div>
  )
}

function PreviewCard({ linkData }) {
  return (
    <table>
      <tbody>
        <tr>
          <td>{linkData.date}</td>
          <td>{linkData.time}</td>
          <td>{linkData.raceNumber}</td>
          <td><a href={linkData.heatLink} target="_blank">{linkData.heatType}</a></td>
          <td>{linkData.kartNumber}</td>
          <td>{linkData.position}</td>
          <td>{linkData.bestTime}</td>
        </tr>
      </tbody>
    </table>

  )
}


export default App;
