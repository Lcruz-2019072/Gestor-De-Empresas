import { Schema, model} from "mongoose"

const companySchema = Schema({
    Company: {
        type: String,
        required: true
    },
    Years: {
        type: String,
        required: true
    },
    Impact: {
        type: String,
        enum: ['NEW', 'MID', 'MID-HIGH', 'HIGH'],
        uppercase: true,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    }
},
{
    versionKey: false
})

export default model('company', companySchema)