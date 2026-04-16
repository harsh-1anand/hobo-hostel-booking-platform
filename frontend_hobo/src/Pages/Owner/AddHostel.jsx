import { useState } from "react";
import axios from "axios";

function AddHostel() {

  const [hostel, setHostel] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    availableBeds: ""
  });

  const handleChange = (e) => {
    setHostel({
      ...hostel,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/hostels",
        hostel,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Hostel added successfully");
      console.log(res.data);

    } catch (error) {
      console.error(error);
      alert("Error adding hostel");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        name="name"
        placeholder="Hostel Name"
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price"
        onChange={handleChange}
      />

      <input
        name="availableBeds"
        placeholder="Beds"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <button type="submit">Add Hostel</button>

    </form>
  );
}

export default AddHostel;