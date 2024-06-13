import { useState } from "react";
import "./PredictionForm.css";
import Loading from "../../components/loading/Loading";
import { useDispatch } from "react-redux";
import { addPredictionsDB } from "../../features/userSlice";
import { toast } from "react-toastify";

const PredictionForm = ({ user }) => {
  const dispatch = useDispatch();

  const [formActive, setformActive] = useState(true);
  const [error,setError]=useState(null)
  const [result, setresult] = useState("");
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Sex: "",
    Age: "",
    M10: "",
    M12: "",
    Stream: "",
    IQ: "",
    Test: "",
    Skills: "",
    Exam: "",
  });

  const getDateTime = () => {
    let currentdate = new Date();
    let date = currentdate.toDateString();
    let time = currentdate.toLocaleTimeString();
    return [date, time];
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData?.Age<17 || formData.Age >20){
      toast.error("Age Should be Between 17 and 20")
      return;
    }
    if(formData?.M10>100 || formData?.M10<0 || formData?.M12>100 || formData?.M12<0){
      toast.error("Percentage Should be Between 0 and 100")
      return;
    }
    if(formData?.Skills.split(',').length !== 4){
      toast.error("Enter Exactly 4 Skills")
      return;
    }
    if(formData.Test<0 || formData.Test>100){
      toast.error("Generel Test Score Should be Between 0 and 100")
      return;
    }
   
    
    setloading(true);
    try {
      let res = await fetch(import.meta.env.VITE_FLASK_BACKEND, {
        // mode: 'no-cors',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      // Handle the response (success or error)
      await res.json().then((data) => {
        let predictionsMedia = {
          ...data,
          ...formData,
          timestamp: getDateTime(),
        };
        setresult(data);
        dispatch(
          addPredictionsDB({ media: predictionsMedia, email: user.email })
        );
        setformActive(false);
      });
    } catch (error) {
      console.error("Error submitting form data:", error);
    } finally {
      setloading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : formActive ? (
    <form className="pred-form" onSubmit={handleSubmit}>
      <h2>Student Information Form</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-container">
        <div className="input-div">
          <label htmlFor="Name">Name:</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-div">
          <label htmlFor="Sex">Sex:</label>
          <select
            id="Sex"
            name="Sex"
            value={formData.Sex}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="input-div">
          <label htmlFor="Age">Age:</label>
          <input
            type="number"
            id="Age"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-div">
          <label htmlFor="M10">10th Percentage:</label>
          <input
            type="number"
            id="M10"
            name="M10"
            value={formData.M10}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-div">
          <label htmlFor="M12">12th Percentage:</label>
          <input
            type="number"
            id="M12"
            name="M12"
            value={formData.M12}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-div">
          <label htmlFor="Stream">Stream:</label>
          {/* <input
            type="text"
            id="Stream"
            name="Stream"
            value={formData.Stream}
            onChange={handleChange}
            required
          /> */}
           <select
            id="Stream"
            name="Stream"
            value={formData.Stream}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Maths">Maths</option>
            <option value="Biology">Biology</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
          </select>
        </div>
        <div className="input-div">
          <label htmlFor="Skills">Skills:</label>
          <input
            type="text"
            id="Skills"
            name="Skills"
            value={formData.Skills}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-div">
          <label htmlFor="IQ">IQ:</label>
          <input
            type="number"
            id="IQ"
            name="IQ"
            value={formData.IQ}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-div">
          <label htmlFor="Test">General Test Score ( 0-100 ):</label>
          <input
            type="number"
            id="Test"
            name="Test"
            value={formData.Test}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-div">
          <label htmlFor="Exam">Competitive Exam:</label>
                <select
            id="Exam"
            name="Exam"
            value={formData.Exam}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>        
          </select>
        </div>
        
      </div>
      <button type="submit">Submit</button>
    </form>
  ) : (
    <div className="pred-result">
      <h1>Prediction Result</h1>
      <p>
        Hi, <span>{result.username}</span>, the best suited career option for
        you is <span>{result.career}</span>
      </p>
      <button
        onClick={() => {
          setformActive((prev) => !prev);
          setFormData({
            Name: "",
            Sex: "",
            Age: "",
            M10: "",
            M12: "",
            Stream: "",
            IQ: "",
            Test: "",
            Skills: "",
            Exam: "",
            });
        }}
      >
        Predict Again
      </button>
    </div>
  );
};

export default PredictionForm;