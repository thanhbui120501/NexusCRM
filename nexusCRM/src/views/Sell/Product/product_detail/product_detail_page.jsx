import { useParams } from "react-router-dom";

export default function ProductDetailPage(){
    //get account_id
    const { id } = useParams();

    return(
        <h1>Mã sản phẩm {id}</h1>
    );
}