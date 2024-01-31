import mongoose from "mongoose";

const connect = async (URL) => {

    try{
        await mongoose.connect(URL, {
            // useNewUrlParser : true,
            // useUnifiedTopology : true,
        });
    }
    catch(err){
        console.log(err);
    }

}

export default connect;
