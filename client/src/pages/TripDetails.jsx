import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import ActivityBtn from '../components/ActivityBtn';
import DestinationCard from '../components/DestinationCard';

const TripDetails = ({ data }) => {

    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [activities, setActivities] = useState([]);
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const result = data.filter(item => item.id === parseInt(id))[0];
        setTrip(result);
    }, [data, id]);

    useEffect(() => {
        const fetchActivities = async () => {
            const response = await fetch('/api/activities/' + id);
            const data = await response.json();
            setActivities(data);
        }

        const fetchDestinations = async () => {
            const response = await fetch('/api/trips_destinations/destinations/' + id);
            const links = await response.json();
            const destinationData = await Promise.all(
                links.map(link =>
                    fetch('/api/destinations/' + link.destination_id).then(res => res.json())
                )
            );
            setDestinations(destinationData);
        }

        fetchActivities();
        fetchDestinations();
    }, [id]);

    if (!trip) {
        return <div>Loading...</div>;
    }

    return (
        <div className="TripDetails">
            <center><h2>{trip.title}</h2></center>
            <p>{trip.description}</p>
            <p>{trip.start_date} - {trip.end_date}</p>

            <h3>Destinations</h3>
            <div className="destinationsList">
                {
                    destinations.length > 0 ?
                    destinations.map(destination =>
                        <DestinationCard key={destination.id}
                            id={destination.id}
                            destination={destination.destination}
                            description={destination.description}
                            img_url={destination.img_url} />
                    ) : <p className="noResults">No Destinations Yet</p>
                }
            </div>

            <h3>Activities</h3>
            <div className="activitiesList">
                {
                    activities.length > 0 ?
                    activities.map(activity =>
                        <ActivityBtn key={activity.id}
                            id={activity.id}
                            activity={activity.title}
                            num_votes={activity.num_likes} />
                    ) : <p className="noResults">No Activities Yet</p>
                }
            </div>

            <Link to={'/activity/create/' + id}><button>+ Add Activity</button></Link>
            <Link to={'/destination/new/' + id}><button>+ Add Destination</button></Link>
        </div>
    )
}

export default TripDetails
