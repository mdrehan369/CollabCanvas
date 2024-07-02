import mongoose from "mongoose";

const connect = async (URL) => {

    try{
        const connection = await mongoose.connect(URL);
        console.log('Connected To Mongo DB ', connection.connection.host)
    }
    catch(err){
        console.log(err);
    }

}

export default connect;
