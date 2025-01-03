import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers:{                    
        'Accept': 'application/json',
    },
    withCredentials: true,
});

    axiosClient.interceptors.request.use((config)=>{
        const token = localStorage.getItem("ACCESS_TOKEN") || sessionStorage.getItem("ACCESS_TOKEN");
        config.headers.Authorization = `Bearer ${token}`;            
        return config;   
    })

axiosClient.interceptors.response.use(    
    (response) => {              
        return response;
    },
    (error) => {
        try{           
            const {response} = error;
            if(response.status === 401){               
                localStorage.removeItem("ACCESS_TOKEN");
                sessionStorage.removeItem("ACCESS_TOKEN");              
            }
            
        // eslint-disable-next-line no-unused-vars
        } catch (err){           
            alert('ERROR CONNECTION REFUSED');
        }
        
        throw error;
    }
)

export default axiosClient;

