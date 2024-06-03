import { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import Swal from "sweetalert2";
import { collection, addDoc } from 'firebase/firestore';
import { app, db } from 'I:/Programs/pet-care/Pet-Care-main/Pet-Care-main/firebase.config'; // Adjust the import path

import useAuth from "../../../hooks/useAuth";
import useDate from "../../../hooks/useDate";
import useCurrentTime from "../../../hooks/useCurrentTime";
import CustomSelect from "../../../components/CustomSelect";

const image_hosting_key = '2eb05dac6a8e0fad5360ffd33f2da773';
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddPet = () => {
    const [imageFile, setImageFile] = useState(null);
    const { user } = useAuth();
    const currentDate = useDate();
    const currentTime = useCurrentTime();

    const options = [
        { value: 'Cat', label: 'Cat' },
        { value: 'Dog', label: 'Dog' },
        { value: 'Rabbit', label: 'Rabbit' },
        { value: 'Bird', label: 'Bird' },
    ];

    const formik = useFormik({
        initialValues: {
            name: '',
            age: '',
            category: '',
            location: '',
            file: '',
            short_description: '',
            long_description: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, 'Must be 3 characters or more')
                .max(15, 'Must be 15 characters or less')
                .required('Name is required'),
            age: Yup.string()
                .required('Age is required'),
            category: Yup.string()
                .required('Category is required'),
            location: Yup.string()
                .required('Location is required'),
            file: Yup.string()
                .required('Image is required'),
            short_description: Yup.string()
                .required('Short description is required'),
            long_description: Yup.string()
                .required('Long description is required'),
        }),
        onSubmit: async (values) => {
            const imageFileData = new FormData();
            imageFileData.append('image', imageFile);

            try {
                const res = await fetch(image_hosting_api, {
                    method: 'POST',
                    body: imageFileData
                });

                if (!res.ok) {
                    throw new Error('Failed to upload image');
                }

                const imageData = await res.json();
                const imageUrl = imageData.data.display_url;

                const petData = {
                    name: values.name,
                    age: values.age,
                    category: values.category,
                    location: values.location,
                    image: imageUrl,
                    short_description: values.short_description,
                    long_description: values.long_description,
                    adoption_date: currentDate,
                    adoption_time: currentTime,
                    adopted: false,
                    userName: user.displayName,
                    userEmail: user.email
                };

                const docRef = await addDoc(collection(db, 'pets'), petData);
                console.log('Document written with ID: ', docRef.id);

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Pet data has been saved",
                    showConfirmButton: false,
                    timer: 1500
                });

                formik.resetForm();

            } catch (error) {
                console.error('Error uploading image and saving pet data:', error);

                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Failed to save pet data",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
    });

    return (
        <div>
            <div className="bg-base-100 shadow-sm p-8 rounded-lg">
                <h1 className="font-bold text-info text-3xl my-10 mt-6 text-center">Add a pet</h1>
                <form onSubmit={formik.handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-3">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your pet name"
                                className="input input-bordered"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                            ) : null}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Age</span>
                            </label>
                            <input
                                id="age"
                                name="age"
                                type="text"
                                placeholder="Your pet age"
                                className="input input-bordered"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.age}
                            />
                            {formik.touched.age && formik.errors.age ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
                            ) : null}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <CustomSelect
                                options={options}
                                value={formik.values.category}
                                onChange={value => formik.setFieldValue('category', value.value)}
                                className={'py-1'}
                            />
                            {formik.touched.category && formik.errors.category ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.category}</div>
                            ) : null}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="Your pet location"
                                className="input input-bordered"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.location}
                            />
                            {formik.touched.location && formik.errors.location ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.location}</div>
                            ) : null}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Image</span>
                            </label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                className="file-input file-input-bordered file-input-ghost w-full"
                                onBlur={formik.handleBlur}
                                onChange={(event) => {
                                    setImageFile(event.currentTarget.files[0]);
                                    formik.setFieldValue('file', event.currentTarget.files[0]);
                                }}
                            />
                            {formik.touched.file && formik.errors.file ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.file}</div>
                            ) : null}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Short Description</span>
                            </label>
                            <input
                                id="short_description"
                                name="short_description"
                                type="text"
                                placeholder="Your pet short description"
                                className="input input-bordered"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.short_description}
                            />
                            {formik.touched.short_description && formik.errors.short_description ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.short_description}</div>
                            ) : null}
                        </div>
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text">Long Description</span>
                            </label>
                            <textarea
                                id="long_description"
                                name="long_description"
                                placeholder="Your pet long description"
                                className="textarea textarea-bordered text-base h-36"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.long_description}
                            />
                            {formik.touched.long_description && formik.errors.long_description ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.long_description}</div>
                            ) : null}
                        </div>
                        <div className="modal-action flex justify-center pt-4">
                            <button className="btn btn-primary md:text-base md:px-8" type="submit">Add pet</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPet;
