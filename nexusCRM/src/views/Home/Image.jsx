import PropTypes from 'prop-types';
 
//   componentDidMount() {
//     this.getImages();
//   }
 
//   getImages = () => {
//     axios
//       .get("http://localhost:8000/api/images")
//       .then((response) => {
//         if (response.status === 200) {
//           this.setState({
//             images: response.data.data,
//           });
//           console.log(response.data);
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };
 
 

export default function Images(props){
    return (
        <div className="container pt-4">
          <div className="row">
            <div className="col-lg-12">
              <div className="card shadow">
                <div className="card-header">
                  <h4 className="card-title fw-bold"> Images List </h4>
                </div>
                <div className="card-body">
                  <div className="row">
   
                    {/* {
                      this.state.images.length > 0 ? (
                          this.state.images.map((image) => (
                          <div className="col-xl-6 col-lg-8 col-sm-12 col-12 mt-3" key={image.id}>
                              <img src={ "http://localhost:8000/uploads/" + image.image_name } className="img-fluid img-bordered" width="200px"
                              />
                          </div>
                          ))
                      ) : (
                          <h6 className="text-danger text-center">No Image Found </h6>
                      )
                    } */}
                  {
                      // eslint-disable-next-line react/prop-types
                      props.localUser.image_name != null? 
                      <div className="col-xl-6 col-lg-8 col-sm-12 col-12 mt-3" >
                          {/* eslint-disable-next-line react/prop-types */}
                          <img src={ "http://127.0.0.1:8000/uploads/" + props.localUser.image_name} className="img-fluid img-bordered" width="200px"/>
                      </div> : 
                      <h6 className="text-danger text-center">No Image Found </h6>
                  }
                  
                  
                   
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
Images.prototype = {
    props: PropTypes.object.isRequired,   
};