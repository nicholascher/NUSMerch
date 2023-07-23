import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { db, storage, auth } from "../../firebase/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Images/Corner Logo.png";
import { onAuthStateChanged } from "firebase/auth";
import { Form, Button, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { message } from "antd";
import "./Styles.css";

function AddListings() {
  function makeid() {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 14) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        message.error("Not Logged in");
      }
    });

    unsubscribe();
  }, []);

  const navigate = useNavigate();
  const sellersCollectionRef = collection(db, "Sellers");
  const [halls, setHalls] = useState([]);
  const [RC, setRC] = useState([]);
  const [clubs, setClubs] = useState([]);

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [QRUpload, setQRUpload] = useState(null);
  const [dependentOptions, setDependentOptions] = useState([]);
  const [sellerSpecific, setSellerSpecific] = useState("");
  const [price, setPrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [telegram, setTelegram] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);

  useEffect(() => {
    const fetchGroupsAndImages = async () => {
      const groupsCollectionRef = collection(db, "Groups");
      const data = await getDocs(groupsCollectionRef);
      const groupsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const hallsArray = groupsData
        .filter((group) => group.type === "Hall")
        .map((group) => group.name);
      const RCArray = groupsData
        .filter((group) => group.type === "RC")
        .map((group) => group.name);
      const clubsArray = groupsData
        .filter((group) => group.type === "Club")
        .map((group) => group.name);

      setHalls(hallsArray);
      setRC(RCArray);
      setClubs(clubsArray);
    };

    fetchGroupsAndImages();
  }, []);

  const handleSellerTypeChange = (event) => {
    const selectedSellerType = event.target.value;
    setSellerType(selectedSellerType);

    if (selectedSellerType === "Halls") {
      setDependentOptions(halls);
    } else if (selectedSellerType === "RC") {
      setDependentOptions(RC);
    } else if (selectedSellerType === "Clubs") {
      setDependentOptions(clubs);
    } else {
      setDependentOptions([]);
    }

    setSellerSpecific("");
  };

  const handleSellerSpecificChange = (event) => {
    setSellerSpecific(event.target.value);
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setPrice(numericValue);
  };

  const handlePhoneNumber = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setPhoneNumber(numericValue);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 20 },
      sm: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 30 },
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 0 },
    },
  };

  const onFinish = async (values) => {
    if (imageUpload) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(imageUpload.type)) {
        message.error("Please upload a valid JPG or PNG image.");
        return;
      }

      const imagePath = `images/${imageUpload.name + makeid()}`;
      const imageRef = ref(storage, imagePath);

      const QRpath = `QRCodes/${QRUpload.name + makeid()}`;
      const QRref = ref(storage, QRpath);

      const additionalPaths = additionalImages.map((image) => {
        const path = `images/${image.name + makeid()}`;
        return path;
      });

      for (let i = 0; i < additionalPaths.length; i++) {
        let addtionalRef = ref(storage, additionalPaths[i]);
        await uploadBytes(addtionalRef, additionalImages[i]);
      }

      await addDoc(sellersCollectionRef, {
        description,
        name,
        imagePath,
        QRpath,
        additionalPaths,
        sellerType,
        sellerSpecific,
        price,
        createdBy: email,
        paymentOption,
        phoneNumber,
        questions: values.questions,
        telegram,
        instagram,
      });
      await uploadBytes(imageRef, imageUpload);
      await uploadBytes(QRref, QRUpload);

      message.success("Listing Added!");

      navigate("/sellerslistings");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <img
            src={logo}
            alt="Logo"
            className="rounded"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
        <div>
          <Link to="/sellerslistings" className="btn btn-primary">
            Back to Listings
          </Link>
        </div>
      </div>
      <h1 className="text-center mb-6">Add Listing</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={handleSellerTypeChange}
              value={sellerType}
            >
              <option defaultValue>Who are you selling to?</option>
              <option value="RC">RC</option>
              <option value="Clubs">Clubs</option>
              <option value="Halls">Halls</option>
            </select>
            <p></p>
            <select
              className="form-select"
              aria-label="Default select example"
              disabled={!sellerType}
              onChange={handleSellerSpecificChange}
              value={sellerSpecific}
            >
              <option defaultValue>Select an option</option>
              {dependentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p></p>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="productName"
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                maxLength={30}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="productPrice" className="form-label">
                Price
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="text"
                  className="form-control"
                  id="productPrice"
                  name="price"
                  value={price}
                  onChange={handlePriceChange}
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">
                Product Description
              </label>
              <textarea
                className="form-control"
                id="productDescription"
                rows="3"
                name="description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                maxLength={2000}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="productImage" className="form-label">
                Product Display Image
              </label>
              <input
                type="file"
                accept=".jpg, .png"
                className="form-control"
                id="productImage"
                name="image"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="form-file-multiple" className="form-label">
                Additional Product Images
              </label>
              <input
                type="file"
                accept=".jpg, .png"
                className="form-control"
                id="additional images"
                name="image"
                multiple
                onChange={(event) => {
                  const filesArray = Array.from(event.target.files);
                  setAdditionalImages(filesArray);
                }}
              />
            </div>
            <h2 className="text-center">Payment Details</h2>
            <select
              className="form-select mb-3"
              aria-label="Default select example"
              onChange={(event) => {
                setPaymentOption(event.target.value);
              }}
              value={paymentOption}
            >
              <option defaultValue>Payment Options</option>
              <option value="PayNow">PayNow</option>
              <option value="PayLah!">PayLah!</option>
            </select>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  maxLength={15}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="QRcode" className="form-label">
                Payment QR code {"(Paylah! or PayNow)"}
              </label>
              <input
                type="file"
                accept=".jpg, .png"
                className="form-control"
                id="QRCode"
                name="QRcode"
                onChange={(event) => {
                  setQRUpload(event.target.files[0]);
                }}
              />
            </div>
            <h2 className="text-center">Contact Details</h2>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Instagram Handle
              </label>
              <input
                type="text"
                className="form-control"
                id="instagram"
                name="instagram"
                value={instagram}
                onChange={(event) => {
                  setInstagram(event.target.value);
                }}
                maxLength={32}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Telegram Handle
              </label>
              <input
                type="text"
                className="form-control"
                id="telegram"
                name="telegram"
                value={telegram}
                onChange={(event) => {
                  setTelegram(event.target.value);
                }}
                maxLength={32}
              />
            </div>
          </form>

          <h2 className="text-center">Additional Questions</h2>
          <p className="text-center mb-10">
            <small>{"e.g shirt sizes, Room number"}</small>
          </p>
          <Form
            name="dynamic_form_item"
            {...formItemLayoutWithOutLabel}
            onFinish={onFinish}
            style={{ maxWidth: "800px" }}
          >
            <Form.List
              name="questions"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      return Promise.reject(
                        new Error("At least 1 Additional Question")
                      );
                    }
                    if (
                      !description ||
                      !imageUpload ||
                      !name ||
                      !price ||
                      !sellerSpecific ||
                      !sellerType ||
                      !QRUpload ||
                      !paymentOption ||
                      !QRUpload ||
                      !phoneNumber
                    ) {
                      return Promise.reject(
                        new Error("Please fill in all required fields")
                      );
                    }

                    if (!instagram && !telegram) {
                      return Promise.reject(
                        new Error(
                          "Please fill in at least one of the contact details"
                        )
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0
                        ? formItemLayout
                        : formItemLayoutWithOutLabel)}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please input a question",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="Additional questions"
                          style={{ width: "80%", marginRight: "10px" }}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "60%" }}
                      icon={<PlusOutlined />}
                    >
                      Add question
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddListings;
