import React, { useState, useContext } from 'react';
import "./OrganizerUI.css"
import {getCurrentUserID,uploadData } from '../../utilities/firebase'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const OrganizerUI = (props) =>{
    const [orgName, setOrgName] = useState('')
    const [orgEmail, setOrgEmail] = useState('')
    const [orgWebsite, setOrgWebsite] = useState('')
    const [orgSocials, setOrgSocials] = useState('')
    const [orgDescription, setOrgDescription] = useState('')

    function createData(){
        const data = {
            "orgName": orgName,
            "orgEmail": orgEmail,
            "orgWebsite": orgWebsite,
            "orgSocials": orgSocials,
            "orgDescription": orgDescription,
            "orgID": getCurrentUserID()
        }
    
        return data
    }
    
    
    async function processApplication(){
        const data = createData(orgName, orgEmail, orgWebsite, orgSocials, orgDescription)
    
        uploadData("orgApplications", data["orgID"], data)
    
        await sendDiscordMessage(data)

        clearFields()
        props.toggleForm()
        props.setFormSent(true)
    }
    
    async function sendDiscordMessage(data){
        const approveURL = `https://us-central1-wildcat-spotlight.cloudfunctions.net/approveAccount?userID=${encodeURIComponent(data["orgID"])}&orgName=${encodeURIComponent(data["orgName"])}`;
        const declineURL = `https://us-central1-wildcat-spotlight.cloudfunctions.net/declineAccount?userID=${encodeURIComponent(data["orgID"])}&orgName=${encodeURIComponent(data["orgName"])}`;
    
        const messageContent = {
            embeds: [{
                title: `New Organization Info for ${data["orgName"]}`,
                fields: [
                    { name: "User ID", value: data["orgID"], inline: true },
                    { name: "Email", value: data["orgEmail"] || "No email provided" , inline: true },
                    { name: "Socials", value: data["orgSocials"] || "No socials provided" , inline: true },
                    {
                        name: "Website",
                        value: data["orgWebsite"] ? `[Visit Website](${data["orgWebsite"]})` : "No website provided"
                    },

                    { name: "Description", value: data["orgDescription"] || "No description provided" },
                       
                    {
                        name: "Approve",
                        value:  `[Visit Website](${approveURL})` 
                    },
                    {
                        name: "Decline",
                        value:  `[Visit Website](${declineURL})` 
                    },
                    
                    
                ],
                color: 3447003
            }]
        };
    
        const webhookUrl = 'https://discord.com/api/webhooks/1229520911506477180/HLDEDzB-JQgmo8ks_uN2mUPQKvkiB-A5PZPyaY8lqbEvWW5R7cL6VEqafX8IDDmbnCtK'; // Replace this with your actual Discord webhook URL
    
        try {
            // Send the message to Discord
            await axios.post(webhookUrl, messageContent);
             console.log("Message sent to Discord successfully!");
        } catch (error) {
            console.error("Error sending message to Discord:", error);
        }
    }

    function clearFields(){
        setOrgName('');
        setOrgEmail('');
        setOrgSocials('');
        setOrgWebsite('');
        setOrgDescription('');
    }
    
    return(
        <div className="main-container" style={{ paddingBottom: 100 }}>
             <FontAwesomeIcon onClick={() => props.toggleForm()} className="backArrow" icon="fa-solid fa-arrow-left" style={{"width": "20px"}} />
             <span className='page-title'>Become An Organizer</span>
             <div className='field-combo'>
                <p>Organization Name <span style={{"color": "red"}}>*</span></p>
                <input className="generalInput" placeholder="Enter Organization Name" value={orgName}
                         onChange={(e) => { setOrgName(e.target.value)}} />
            </div>
            <div className='field-combo'>
                <p>Organization Email <span style={{"color": "red"}}>*</span></p>
                <input placeholder="Enter Organization Email" className="generalInput" value={orgEmail}
                            onChange={(e) => { setOrgEmail(e.target.value)}} />
            </div>
            <div className='field-combo'>
                <p>Organization Website</p>
                <input placeholder="Enter Organization Website" className="generalInput" value={orgWebsite}
                            onChange={(e) => { setOrgWebsite(e.target.value)}} />
            </div>
            <div className='field-combo'>
                <p>Organization Socials</p>
                <input placeholder="Enter Organization Socials" className="generalInput" value={orgSocials}
                            onChange={(e) => { setOrgSocials(e.target.value)}} />
            </div>
            <div className='field-combo'>
                    <p> Organization Description <span style={{"color": "red"}}>*</span></p>
                    <form action="/submit-event-description" method="post">
                    <textarea
                        value={orgDescription} // Bind the state value
                        onChange={(e) => setOrgDescription(e.target.value)} // Correctly handle the change event
                        className="descriptionBox"
                        id="eventDescription"
                        name="eventDescription"
                        rows="10"
                        cols="50"
                        placeholder="Write a detailed description of the organization."
                    ></textarea>

                    </form>
                </div>

            <button onClick={() =>processApplication(orgName, orgEmail, orgWebsite, orgSocials, orgDescription)} className={(orgDescription.trim() !== "" && orgName.trim() !== "" && orgEmail.trim() !== "") ? "post-button" : "post-button-disabled"}>Submit Application</button>
        </div>
    );
}


export default OrganizerUI