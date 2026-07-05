import {useState} from 'react';
import './ActivityBtn.css'

const ActivityBtn = (props) =>  {

  const [num_votes, setNumVotes] = useState(props.num_votes)

  const updateCount = async () => {
    const options = {
      method: 'PATCH'
    }

    const response = await fetch('/api/activities/' + props.id, options);
    const data = await response.json();
    setNumVotes(data.num_likes);
  }

  return (
    <button className='activityBtn' id={props.id} onClick={updateCount}>
      {props.activity} <br/> {'△ ' + num_votes + ' Upvotes' }
    </button>
  )

}

export default ActivityBtn;
