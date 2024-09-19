import axiosClient from '../../axiosClient';
import Images from './Image';
import React from 'react';
import PropTypes from 'prop-types';
// export default class ImageUpload extends Component{
//     constructor(props) {
//         super(props);
     
//         this.state = {
//           image: "",
//           responseMsg: {
//             status: "",
//             message: "",
//             error: "",
//           },
//         };
//     }

//     // image onchange hander
//     handleChange = (e) => {
        
//         let isValid = "";
    
//         // for (let i = 0; i < e.target.files.length; i++) {
//         // isValid = this.fileValidate(e.target.files[i]);
//         // imagesArray.push(e.target.files[i]);
//         // }
//         // eslint-disable-next-line no-unused-vars
//         isValid = this.fileValidate(e.target.files);
//         this.setState({
//             image: e.target.files,
//         });
        
//     };

//     // submit handler
//     // submitHandler = (e) => {
//     // e.preventDefault();
//     // const data = new FormData();
//     // // for (let i = 0; i < this.state.image.length; i++) {
//     // //   data.append("images[]", this.state.image[i]);
//     // // }
//     // data.append("images", this.state.image)
    
//     // axios.post("http://localhost:8000/api/images", data)
//     //   .then((response) => {
//     //     if (response.status === 200) {
//     //       this.setState({
//     //         responseMsg: {
//     //           status: response.data.status,
//     //           message: response.data.message,
//     //         },
//     //       });
//     //       setTimeout(() => {
//     //         this.setState({
//     //           image: "",
//     //           responseMsg: "",
//     //         });
//     //       }, 100000);
 
//     //       document.querySelector("#imageForm").reset();
//     //       // getting uploaded images
//     //       this.refs.child.getImages();
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     console.error(error);
//     //   });    
//     // }
    


//     // file validation
//   fileValidate = (file) => {
//     if (
//       file.type === "image/png" ||
//       file.type === "image/jpg" ||
//       file.type === "image/jpeg"
//     ) {
//       this.setState({
//         responseMsg: {
//           error: "",
//         },
//       });
//       return true;
//     } else {
//       this.setState({
//         responseMsg: {
//           error: "File type allowed only jpg, png, jpeg",
//         },
//       });
//       return false;
//     }
//   };

  
// }

// eslint-disable-next-line no-unused-vars
export default function ImageUpload(props){
  const [values, setImage] = React.useState({
    image:"",
    status:"",
  });

  const handleChange = (e) => {
    setImage({
      ...values,
      image: e.target.files[0],
    });  
  }
  
  

  const Submit = (ev) => {
        ev.preventDefault(); 
        
        // const payload = {
        //   username: "linh123",
        //   password: "Thanh@123!?",
        //   password_confirm: "Thanh@123!?",
        //   role_id:"R150924031055",
        //   full_name:"Nguyễn Thị Linh",
        //   email:"linh@gmail.com",
        //   images:values.image,    
        // };
        //console.log(typeof payload.images);
        const data = new FormData();
        data.append("username","linh123");
        data.append("password","Thanh@123!?");
        data.append("password_confirm","Thanh@123!?");
        data.append("role_id","R150924031055");
        data.append("full_name","Nguyễn Thị Linh");
        data.append("email","linh@gmail.com");
        data.append("images",values.image);

        //console.log(data.get('images'));

        axiosClient.post("/account/create-new-account", data).then(({data}) => {     
            if(data.status_code == 201){       
              document.querySelector("#imageForm").reset();            
              setImage({
                ...values,
                image: "",
              });  
                console.log('success')
                //this.child.getImages();
            }         
           console.log(data)
        }).catch(err => {
          const response = err.response;
          if(response && err.status === 422){       
            console.log(response.data.errors);       
          }     
        }); 
    };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-12">
          <form onSubmit={Submit} encType="multipart/form-data" id="imageForm">
            <div className="card shadow">
              {/* {this.state.responseMsg.status === "successs" ? (
                <div className="alert alert-success">
                  {this.state.responseMsg.message}
                </div>
              ) : this.state.responseMsg.status === "failed" ? (
                <div className="alert alert-danger">
                  {this.state.responseMsg.message}
                </div>
              ) : (
                ""
              )
              } */}
              <div className="card-header">
                <h4 className="card-title fw-bold">
                  {/* eslint-disable-next-line react/prop-types */}
                  React JS and Laravel 9 RESTful API File Upload {props.localUser.full_name}                   
                </h4>
              </div>

              <div className="card-body">
                <div className="form-group py-2">
                  <label htmlFor="images">Images</label>
                  <input
                    id="image"
                    type="file"
                    name="image"                    
                    onChange={handleChange}
                    className="form-control"
                  />
                  <span className="text-danger">
                    {/* {this.state.responseMsg.error} */}
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <button type="submit" className="btn btn-success">
                  Upload
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* // eslint-disable-next-line react/prop-types , react/prop-types*/},
      {/* <Images  localUser={props.localUser}/>  */}
    </div>
  );
}

ImageUpload.prototype={
  props: PropTypes.object.isRequired,
}