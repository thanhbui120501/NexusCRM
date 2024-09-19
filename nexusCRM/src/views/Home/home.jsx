import ImageUpload from "./ImageUpload.";
import PropTypes from 'prop-types';
export default function Home(props){

    
    return(
        <div>
            <h1 className="text-3xl font-bold underline">
            {/* eslint-disable-next-line react/prop-types */}
            This is home of {props.localUser.username}
            </h1> 
            {/* eslint-disable-next-line react/prop-types */}
            <ImageUpload localUser={props.localUser}/>
        </div>
        
    );
}
Home.prototype = {
    props: PropTypes.object.isRequired,   
};