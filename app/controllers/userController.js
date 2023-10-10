const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');

// ----X---- Image upload ----X----
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/images');
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + Date.now() + ext);
//     }
// });

// const upload = multer({ storage: storage })  


// Test only - .env
const SECRET_KEY = "FORM-TESTING-THE-JWTs";

// ----X---- User modules ----X----

const signUp = async (req, res) => {

    try {
        // // Multer upload middleware for image fields (passportPhoto and signature)
        // const uploadMiddleware = upload.fields([
        //     { name: 'passportPhoto', maxCount: 1 },
        //     { name: 'signature', maxCount: 1 }
        //   ]);
      
        //   // Perform image upload
        // uploadMiddleware(req, res, async (err) => {
        //     if (err) {
        //     console.error(err);
        //     return res.status(400).json({ error: 'Error uploading images' });
        //     }

        //     // Images uploaded successfully
        //     const passportPhotoPath = req.files['passportPhoto'][0].path;
        //     const signaturePath = req.files['signature'][0].path;
      
        const {
            username,
            phone_number,
            password,
            name,
            fathers_name,
            husbands_name,
            dob,
            blood_group,
            community,
            gender,
            religion,
            ssc_coi_holder_number,
            permanent_address,
            email_id
        } = req.body;
        // Existing User
        const [existingUser] = await pool.query("SELECT * FROM user WHERE username = ? and phone_number = ?", [username, phone_number]);
        // Error
        if (existingUser.length != 0) {
            return res.status(403).json({
                    msg: "User data already exists (Check username and phone number)",
                    error: "Resource already exists"    
                });
        }

        // Hashed Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // New User Registration
        const insertUserQuery = `INSERT INTO user 
                                    (username, phone_number, password, name, 
                                    fathers_name, husbands_name, dob, blood_group, 
                                    community, gender, religion, ssc_coi_holder_number, 
                                    permanent_address, email_id)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
        
        // DOB format : YYYY-MM-DD
        const values = [
                            username,
                            phone_number,
                            hashedPassword,
                            name,
                            fathers_name || null, // Handle fathers_name as optional
                            husbands_name || null, // Handle husbands_name as optional
                            dob, // YYYY-MM-DD format
                            blood_group,
                            community,
                            gender,
                            religion,
                            ssc_coi_holder_number,
                            permanent_address,
                            email_id || null 
                        ]        

        const [result] = await pool.query(insertUserQuery, values);                                        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Error, could not insert new User.'});
        }
        
        const newUserId = result.insertId;

        // Assign the default role "user" with "id: 2" to the new user
        const roleInsertQuery = await pool.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
                                        [newUserId, 2]);
        if (roleInsertQuery.affectedRows === 0) {
            return res.status(500).json({ msg: 'Internal server error.'});
        }

        // Token Generation for automatic sign in after sign up is complete
        const token = jwt.sign({
                username: username, 
                id: newUserId}, 
                SECRET_KEY, 
                {expiresIn: '1h'}
        );

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        res.status(200).json({
            user: result
        });

    } catch (error) {
        console.error('Error inserting user data: ', error);
        res.status(500).send('Error inserting User data.');
    }
}

const signIn = async (req, res) => {
 
    try {
        const { username, password } = req.body;
        // Check Existing User
        const [existingUser] = await pool.query("SELECT * FROM user WHERE username = ?", username);
        if (existingUser.length === 0) {
            return res.status(404).json({
                    msg: "User not found"    
                });
        }
        const matchPassword = await bcrypt.compare(password, existingUser[0].password);
        if (!matchPassword) {
            return res.status(400).json({
                msg: "Invalid Credentials",
                error: "Incorrect Password"
            });
        }
        
        // Token Expiry
        // https://www.geeksforgeeks.org/how-long-jwt-token-valid/ 
        
        // Retrieve assigned roles of the user
        const [userRoles] = await pool.query(`SELECT R.role_name 
                                                FROM User_Roles UR 
                                                JOIN Roles R ON UR.role_id = R.role_id 
                                                WHERE UR.user_id = ?`, existingUser[0].user_id);

        if (userRoles.length === 0) {
            return res.status(500).json({
                    msg: "Error Retrieving Roles"    
                });
        }        
        
        const roles = userRoles.map(userRoles => userRoles.role_name);

        console.log(roles);

        const token = jwt.sign({ username: existingUser[0].username, 
                                    id: existingUser[0].user_id, 
                                    roles: roles}, SECRET_KEY, 
                                    {expiresIn: '1h'});

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        res.status(200).send({msg: "Success"});
        // res.status(200).redirect('/pages-blank');

    } catch (err) {
        console.log(err);
        res.status(500).send('Incorrect username or password');
    }
}


const logOut = async (req, res) => {
    return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
}

// ----X---- User Module -> Employee Details ----X----

// USE JS DOCS
const addEmployeeDetails = async (req, res) => {
    
    try {
        console.log("SUCCESSFULLY AUTHENTICATED/AUTHORIZED");
        res.sendStatus(200);
        // const user_id = req.userId;
        
        // // Check if employee details already added 
        // const empCheck = await pool.query(`SELECT * FROM employee_details 
        //                                     WHERE user_id = ?`, user_id);
        // if (empCheck.length > 0) {
        //     return res.status(403).json({ msg: 'Resource already populated'});
        // }

        // const {
        //     GPF_CPF_num,
        //     date_of_first_appointment,
        //     designation_at_appointment,
        //     current_scale,
        //     present_designation,
        //     department,
        //     date_of_promotion,
        //     education_qualification,
        //     other_qualifications,
        //     special_status_employee,
        //     type_of_employment
        // } = req.body;
    
        // const values = [
        //     user_id, 
        //     GPF_CPF_num, 
        //     date_of_first_appointment, 
        //     designation_at_appointment, 
        //     current_scale, 
        //     present_designation, 
        //     department, 
        //     date_of_promotion || null, 
        //     education_qualification, 
        //     other_qualifications || null , 
        //     special_status_employee, 
        //     type_of_employment
        // ];

        // const insertEmployeeQuery = `
        //     INSERT INTO employee_details (
        //         user_id, GPF_CPF_num, date_of_first_appointment, 
        //         designation_at_appointment, current_scale, present_designation, 
        //         department, date_of_promotion, education_qualification, 
        //         other_qualifications, special_status_employee, type_of_employment
        //     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        // `;

        // const [result] = await pool.query(insertEmployeeQuery, values);                                        
        // if (result.affectedRows === 0) {
        //     return res.status(404).json({ msg: 'Error, could not insert Employee data.'});
        // }

        // res.status(200).json({ success: true, message: 'Employee details added successfully.' });

    }   catch (error) {
        console.error('Error inserting Employee data: ', error);
        res.status(500).send('Error inserting Employee data.');
    }
}

// PUT -> To replace entire resource (Payload must contain entire resource description)
// PATCH -> To replace partial fields 
// const updateEmployeeDetails = async (req, res) => {
//     try {
//         const user_id = req.userId;

//         // Check if employee details exist
//         const empCheck = await pool.query('SELECT * FROM employee_details WHERE user_id = ?', user_id);

//         if (empCheck.length === 0) {
//             return res.status(404).json({ msg: 'Employee details not found for the given user.' });
//         }

//         const {
//             GPF_CPF_num,
//             date_of_first_appointment,
//             designation_at_appointment,
//             current_scale,
//             present_designation,
//             department,
//             date_of_promotion,
//             education_qualification,
//             other_qualifications,
//             special_status_employee,
//             type_of_employment
//         } = req.body;

//         const updatedFields = [];
//         const values = [user_id];

//         if (GPF_CPF_num !== undefined) {
//             updatedFields.push('GPF_CPF_num = ?');
//             values.push(GPF_CPF_num);
//         }
//         // Add similar blocks for other fields
//         if (date_of_first_appointment !== undefined) {
//             updatedFields.push('date_of_first_appointment = ?');
//             values.push(date_of_first_appointment);
//         }
//         if (designation_at_appointment !== undefined) {
//             updatedFields.push('designation_at_appointment = ?');
//             values.push(designation_at_appointment);
//         }
//         if (current_scale !== undefined) {
//             updatedFields.push('current_scale = ?');
//             values.push(current_scale);
//         }
//         if (present_designation !== undefined) {
//             updatedFields.push('present_designation = ?');
//             values.push(present_designation);
//         }
//         if (department !== undefined) {
//             updatedFields.push('department = ?');
//             values.push(department);
//         }
//         if (date_of_promotion !== undefined) {
//             updatedFields.push('date_of_promotion = ?');
//             values.push(date_of_promotion);
//         }
//         if (education_qualification !== undefined) {
//             updatedFields.push('education_qualification = ?');
//             values.push(education_qualification);
//         }
//         if (other_qualifications !== undefined) {
//             updatedFields.push('other_qualifications = ?');
//             values.push(other_qualifications);
//         }
//         if (special_status_employee !== undefined) {
//             updatedFields.push('special_status_employee = ?');
//             values.push(special_status_employee);
//         }
//         if (type_of_employment !== undefined) {
//             updatedFields.push('type_of_employment = ?');
//             values.push(type_of_employment);
//         }
//         //
//         const updateEmployeeQuery = `
//             UPDATE employee_details 
//             SET ${updatedFields.join(', ')}
//             WHERE user_id = ?;
//         `;

//         const [result] = await pool.query(updateEmployeeQuery, values);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ msg: 'Error, could not update Employee data.' });
//         }

//         res.status(200).json({ success: true, message: 'Employee details updated successfully.' });
//     } catch (error) {
//         console.error('Error updating Employee data: ', error);
//         res.status(500).send('Error updating Employee data.');
//     }
// };


module.exports = {
    signUp,
    signIn,
    logOut,
    addEmployeeDetails
}