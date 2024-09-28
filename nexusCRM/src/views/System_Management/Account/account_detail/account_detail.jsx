import { useParams } from 'react-router-dom';

export default function AccountDetail(){
    const { id } = useParams(); 
    return(
        <h1>ID:{id}</h1>
    );
}