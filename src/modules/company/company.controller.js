import { Company } from '../../../database/models/company.model.js';
import { Job } from '../../../database/models/job.model.js';
import { Application } from './../../../database/models/application.model.js';
import { catchError } from './../../middlewares/error/catch-error.middleware.js';
import { sendResponse } from '../../utils/send-response.utils.js';
import { ApiError } from '../../utils/api-error.utils.js';
import { createOne, deleteOne, updateOne } from '../../utils/handlers-factory.utils.js';
import { generateExcelSheet } from '../../utils/genrate-applications-sheet.utils.js';

export const addCompany = createOne(Company, 'companyHR');
export const updateCompany = updateOne();
export const deleteCompany = deleteOne();


// Get Specific company by id with jobs 
export const getCompanyByIdWithJobs = catchError(async (req, res, next) => {
    const { id } = req.params;
    const company = await Company.findById(id).populate([
        { path: 'companyHR', select: 'username email' },
        {
            path: 'jobs',
            select: 'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills',
        }]
    );
    if (!company) {
        return next(new ApiError('Company not found', 404, 'getCompanyByIdWithJobs constroller'));
    }
    return sendResponse(res, { data: company });
});

// Get company list and Search for a company name.  
export const getCompanyList = catchError(async (req, res, next) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query = { companyName: { $regex: search, $options: 'i' } };
    }
    const company = await Company.find(query);
    return sendResponse(res, { data: company });
});


