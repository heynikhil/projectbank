const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BankBranch = new Schema({
    main_bank_id: { type: String, required: [true, 'Please enter Value.'] },
    branch_name: { type: String, required: [true, 'Please enter Value.'] },
    branch_detail: { type: String, required: [true, 'Please enter Value.'] },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
})
module.exports = mongoose.model('bankbranch', BankBranch)
