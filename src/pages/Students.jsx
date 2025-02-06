import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Import react icons
import { FaTimes } from "react-icons/fa"; // Import close icon

const Students = () => {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false); // For View modal
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    section: "",
    rollNumber: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    guardianName: "",
    guardianPhone: "",
    admissionDate: ""
  });
  const [editingStudent, setEditingStudent] = useState(null); // For Edit
  const [viewingStudent, setViewingStudent] = useState(null); // For View

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getDocs(collection(db, "students"));
        setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.className || !formData.section || !formData.rollNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (editingStudent) {
        const studentRef = doc(db, "students", editingStudent.id);
        await updateDoc(studentRef, { ...formData });

        setStudents(students.map(student =>
          student.id === editingStudent.id ? { ...formData, id: student.id } : student
        ));
      } else {
        const docRef = await addDoc(collection(db, "students"), {
          name: formData.name,
          className: formData.className,
          section: formData.section,
          rollNumber: parseInt(formData.rollNumber),
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          guardianName: formData.guardianName,
          guardianPhone: formData.guardianPhone,
          admissionDate: formData.admissionDate || new Date().toISOString().split("T")[0]
        });

        setStudents([...students, { ...formData, id: docRef.id }]);
      }

      setFormData({
        name: "", className: "", section: "", rollNumber: "", age: "", gender: "",
        address: "", phone: "", email: "", guardianName: "", guardianPhone: "", admissionDate: ""
      });
      setEditingStudent(null);
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating student:", error);
      alert("Failed to save student. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const studentRef = doc(db, "students", id);
      await deleteDoc(studentRef);
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Check console for details.");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ ...student }); // Pass student data to formData for editing
    setModalOpen(true); // Open the modal for editing
  };

  const handleView = (student) => {
    setViewingStudent(student); // Pass student data to viewingStudent for viewing
    setViewModalOpen(true); // Open the view modal
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="p-4 w-full bg-gray-900 text-white">
        <button
          onClick={() => {
            setFormData({ // Reset the form
              name: "", className: "", section: "", rollNumber: "", age: "", gender: "",
              address: "", phone: "", email: "", guardianName: "", guardianPhone: "", admissionDate: ""
            });
            setEditingStudent(null); // Clear editing state
            setModalOpen(true); // Open modal for adding
          }}
          className="bg-blue-800 text-white p-2 mb-4 rounded w-full sm:w-auto"
        >
          Add Student
        </button>


        <table className="w-full border-collapse border border-gray-600">
          <thead>
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Class</th>
              <th className="p-2">Section</th>
              <th className="p-2">Roll Number</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}>
                <td className="p-2 text-center">{student.id}</td>
                <td className="p-2 text-center">{student.name}</td>
                <td className="p-2 text-center">{student.className}</td>
                <td className="p-2 text-center">{student.section}</td>
                <td className="p-2 text-center">{student.rollNumber}</td>
                <td className="p-2 flex justify-center gap-1">
                  <button onClick={() => handleView(student)} className="text-blue-400">
                    <FaEye />
                  </button>
                  <button onClick={() => handleEdit(student)} className="text-yellow-400">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(student.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-10 px-4">
            <div className="relative w-full max-w-3xl p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">

              {/* Close Icon Button */}
              <button
                onClick={() => { setModalOpen(false); }}
                className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl"
              >
                <FaTimes />
              </button>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-100">
                {editingStudent ? "Edit Student" : "Add Student"}
              </h2>

              {/* Form with Responsive Grid (Max 3 Columns) */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(formData).map((key) => {
                  let inputType = "text";
                  if (key === "email") inputType = "email";
                  if (key === "phone" || key === "guardianPhone") inputType = "tel";
                  if (key === "admissionDate") inputType = "date";
                  if (key === "age" || key === "rollNumber") inputType = "number";

                  return (
                    <div key={key} className="flex flex-col">
                      <label className="text-gray-300 text-sm mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type={inputType}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        required={["name", "className", "section", "rollNumber"].includes(key)}
                      />
                    </div>
                  );
                })}

                {/* Full Width Submit Button */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {editingStudent ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* View Modal */}
        {viewModalOpen && viewingStudent && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-10 px-4">
            <div className="relative bg-gray-800 p-6 md:p-8 rounded-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl shadow-lg">

              {/* Close Icon Button */}
              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl"
              >
                <FaTimes />
              </button>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-white mb-6 text-center">Student Details</h2>

              {/* Student Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <p className="flex items-center"><strong className="text-white w-32">Name:</strong> {viewingStudent?.name}</p>
                <p className="flex items-center"><strong className="text-white w-32">Class:</strong> {viewingStudent?.className}</p>
                <p className="flex items-center"><strong className="text-white w-32">Section:</strong> {viewingStudent?.section}</p>
                <p className="flex items-center"><strong className="text-white w-32">Roll Number:</strong> {viewingStudent?.rollNumber}</p>
                <p className="flex items-center"><strong className="text-white w-32">Age:</strong> {viewingStudent?.age}</p>
                <p className="flex items-center"><strong className="text-white w-32">Gender:</strong> {viewingStudent?.gender}</p>
                <p className="flex items-center sm:col-span-2 lg:col-span-3"><strong className="text-white w-32">Address:</strong> {viewingStudent?.address}</p>
                <p className="flex items-center"><strong className="text-white w-32">Phone:</strong> {viewingStudent?.phone}</p>
                <p className="flex items-center"><strong className="text-white w-32">Email:</strong> {viewingStudent?.email}</p>
                <p className="flex items-center"><strong className="text-white w-32">Guardian Name:</strong> {viewingStudent?.guardianName}</p>
                <p className="flex items-center"><strong className="text-white w-32">Guardian Phone:</strong> {viewingStudent?.guardianPhone}</p>
                <p className="flex items-center"><strong className="text-white w-32">Admission Date:</strong> {viewingStudent?.admissionDate}</p>
              </div>

            </div>
          </div>
        )}





      </div>
    </div>
  );
};

export default Students;
