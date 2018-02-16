const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Loan = new Schema({
    name_of_applicant: { type: String, required: [true, 'Please enter Value.'] },
    purpose: { type: String, required: [true, 'Please enter Value.'] },
    bank_id: { type: String, required: [true, 'Please enter Value.'] },
    bank_branch_id: { type: String, required: [true, 'Please enter Value.'] },
    date_of_received: { type: Date, required: [true, 'Please enter Value.'] },
    date_of_sent: { type: Date, required: [true, 'Please enter Value.'] },
    visit_done_by: { type: String, required: [true, 'Please enter Value.'] },
    fees: { type: String, required: [true, 'Please enter Value.'] },
    tax: { type: String, required: [true, 'Please enter Value.'] },
    total_fees: { type: String, required: [true, 'Please enter Value.'] },
    paid_unpaid: { type: String, required: [true, 'Please enter Value.'] },
    cash_cheque: { type: String, required: [true, 'Please enter Value.'] },
    remarks: { type: String, required: [true, 'Please enter Value.'] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})
module.exports = mongoose.model('loan', Loan)
