import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Firebase Admin SDK with your project's credentials
# Replace 'path/to/your/serviceAccountKey.json' with the path to your Firebase project's service account key file
cred = credentials.Certificate('Wildcat Spotlight Firebase Admin.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Your events data
events_data = [
    {
        "eventID": 100030318,
        "eventName": "Classical Music Evening",
        "eventLoc": "Lutkin Hall",
        "eventDesc": "An elegant evening of classical music performances.",
        "eventStart": "2024-07-01T19:00:00Z",
        "eventEnd": "2024-07-01T22:00:00Z",
        "orgID": 12346,
        "orgName": "NU Music Group",
        "eventPhoto": "https://static01.nyt.com/images/2019/06/14/arts/14listings-classical2/merlin_155916339_f4a48136-9fdb-4a5b-8a07-96272af821ba-superJumbo.jpg",
        "userID": 1222227,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Music",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/",
        "latitude": 42.0510,
        "longitude": 87.6802
    },
    {
        "eventID": 100030314,
        "eventName": "Rock Band Blast",
        "eventLoc": "McCormick Auditorium",
        "eventDesc": "Rock out with Northwestern's finest student and alumni rock bands.",
        "eventStart": "2024-07-09T19:00:00Z",
        "eventEnd": "2024-07-09T21:00:00Z",
        "orgID": 12345,
        "orgName": "The Brewbike Team",
        "eventPhoto": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsOAI6jOtmqJRC3IyqjNQBQG14zSCcU64v1hOPzUR2JQ&s",
        "userID": 1222231,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Music",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030319,
        "eventName": "Global Film Festival",
        "eventLoc": "Annie May Swift Hall",
        "eventDesc": "A weekend festival featuring films from around the world, curated by Northwestern's film studies students.",
        "eventStart": "2024-07-25T18:00:00Z",
        "eventEnd": "2024-07-27T22:00:00Z",
        "orgID": 12350,
        "orgName": "Cinephile Society",
        "eventPhoto": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIo5fZOCoheEoRCv6kwJF63-nK0XfPdHctKPeNasNGuA&s",
        "userID": 1222250,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Cinema",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030320,
        "eventName": "Eco-Sustainability Conference",
        "eventLoc": "Harris Hall",
        "eventDesc": "Join us for insightful discussions and workshops on sustainability and green initiatives.",
        "eventStart": "2024-07-18T10:00:00Z",
        "eventEnd": "2024-07-18T15:00:00Z",
        "orgID": 12351,
        "orgName": "GreenNU",
        "eventPhoto": "https://www.aljazeera.com/wp-content/uploads/2019/10/94e37524b6014329b60a5889f8ef5134_18.jpeg?resize=770%2C513&quality=80",
        "userID": 1222255,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Conference",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030321,
        "eventName": "Poetry Slam Night",
        "eventLoc": "The Black House",
        "eventDesc": "A night of powerful spoken word and poetry performances from Northwestern's most talented poets.",
        "eventStart": "2024-07-22T19:00:00Z",
        "eventEnd": "2024-07-22T21:00:00Z",
        "orgID": 12352,
        "orgName": "WordSmiths Collective",
        "eventPhoto": "https://scottwoodsmakeslists.files.wordpress.com/2015/07/poetry_vancouver.jpg",
        "userID": 1222260,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Poetry",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030310,
        "eventName": "Comedy Night",
        "eventLoc": "Pick-Staiger Concert Hall",
        "eventDesc": "A lineup of Northwestern's funniest comedians ready to make you laugh.",
        "eventStart": "2024-07-08T16:00:00Z",
        "eventEnd": "2024-07-08T18:00:00Z",
        "orgID": 12347,
        "orgName": "NU Threads",
        "eventPhoto": "https://media.cntraveler.com/photos/5c2cfd936b0c2057eb60d57b/master/pass/The-Stand_DSC_1824.jpg",
        "userID": 1222234,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Comedy",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030311,
        "eventName": "A Cappella Concert",
        "eventLoc": "Norris University Center",
        "eventDesc": "An evening of stunning vocal performances by Northwestern's premier a cappella groups.",
        "eventStart": "2024-07-05T17:00:00Z",
        "eventEnd": "2024-07-05T20:00:00Z",
        "orgID": 12346,
        "orgName": "NU A Cappella",
        "eventPhoto": "https://images.squarespace-cdn.com/content/v1/57e01ea36b8f5b62f6667771/1519936557004-TYS7UIUMEUR6S9LZEON8/UMass+Doo+Wop+Shop+%281%29.JPG",
        "userID": 1222235,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Music",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030312,
        "eventName": "Theater Night",
        "eventLoc": "Pick-Staiger Concert Hall",
        "eventDesc": "A selection of captivating plays and musicals performed by talented student actors.",
        "eventStart": "2024-07-29T17:00:00Z",
        "eventEnd": "2024-07-29T19:00:00Z",
        "orgID": 12344,
        "orgName": "NU Theater Club",
        "eventPhoto": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5JplwCeKXoXvuwDg-RJ_YHBdjYO0YZG4p3Qpk7bxu6w&sb",
        "userID": 1222230,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Theater",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030316,
        "eventName": "Jazz Under the Stars",
        "eventLoc": "Deering Meadow",
        "eventDesc": "Experience an enchanting evening of jazz music under the open sky, featuring Northwestern's jazz ensembles.",
        "eventStart": "2024-07-15T20:00:00Z",
        "eventEnd": "2024-07-15T23:00:00Z",
        "orgID": 12348,
        "orgName": "The Swing Society",
        "eventPhoto": "https://jazzforumarts.org/wp-content/uploads/2023/01/Jazz-musicians-playing-at-the-Dobbs-Ferry-Summer-Concert-768x512.webp",
        "userID": 1222240,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Music",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030317,
        "eventName": "Tech Innovations Symposium",
        "eventLoc": "Ford Engineering Design Center",
        "eventDesc": "A day-long symposium showcasing cutting-edge technology projects by Northwestern students.",
        "eventStart": "2024-07-12T09:00:00Z",
        "eventEnd": "2024-07-12T17:00:00Z",
        "orgID": 12349,
        "orgName": "NU Innovators",
        "eventPhoto": "https://marvel-b1-cdn.bc0a.com/f00000000277771/sitecorecms.bsu.edu//-/media/www/departmentalcontent/biology/images/science-fair/science-fair-aerial-photo---cropped.jpg?h=561&w=1000&hash=452E5804250948E9CF25543803B71B9A9BCB3EE0",
        "userID": 1222245,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Conference",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030322,
        "eventName": "Health and Wellness Fair",
        "eventLoc": "Norris University Center",
        "eventDesc": "Discover wellness resources, participate in fitness demos, and connect with health professionals.",
        "eventStart": "2024-07-30T12:00:00Z",
        "eventEnd": "2024-07-30T17:00:00Z",
        "orgID": 12353,
        "orgName": "NU Wellness Warriors",
        "eventPhoto": "https://www.himss.org/sites/hde/files/media/image/2022/08/24/coming-to-chicago-2023-himss-global-health-conference-exhibition.jpg",
        "userID": 1222265,
        "attending": 0,
       "eventCapacity": 50,
        "eventType": "Conference",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    },
    {
        "eventID": 100030315,
        "eventName": "Improv Showdown",
        "eventLoc": "Shanley Pavilion",
        "eventDesc": "A hilarious night of improvisation, where anything can happen.",
        "eventStart": "2024-07-19T19:00:00Z",
        "eventEnd": "2024-07-19T22:00:00Z",
        "orgID": 12342,
        "orgName": "Project Improv",
        "eventPhoto": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Teatersport_-4.jpg",
        "userID": 1222233,
        "attending": 0,
        "eventCapacity": 50,
        "eventType": "Comedy",
        "eventDuration": "5 hours",
        "eventTicket": "https://www.ticketmaster.com/"
    }
]

# Function to add an event to the Firestore database
def add_event(event):
    doc_ref = db.collection('events').document(str(event['eventID']))
    doc_ref.set(event)

# Iterate over the events data and add each event to the database
for event in events_data:
    add_event(event)

print("Data has been successfully added to Firestore.")
