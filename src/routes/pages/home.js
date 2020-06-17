import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";

function Home() {
  const history = useHistory();
  const [user, setUser] = useState("default");
  const [custs, setCust] = useState([]);
  const [prods, setProd] = useState([]);
  const [showP, setShowP] = useState(false);
  const [showD, setShowD] = useState(false);
  const [showD2, setShowD2] = useState(false);
  const [showA, setShowA] = useState(false);
  const [createP, setP] = useState(false);
  const [createC, setC] = useState(false);
  const [capprove, setApprove] = useState(false);
  const [price, setPrice] = useState(0);
  const [pid, setPid] = useState("");
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAdd] = useState("");
  const [delId, setdId] = useState("");
  const [type, setype] = useState("");

  const createProd = e => {
    setP(!createP);
    setC(false);
    setShowD2(false);
    setShowA(false);
    setShowD(false);
  };
  const createCust = e => {
    setC(!createC);
    setP(false);
    setShowA(false);
    setShowD2(false);
    setShowD(false);
    setShowP(false);
  };

  const displayChangeP = e => {
    setShowP(!showP);
    setShowA(false);
    setShowD(false);
    setShowD2(false);
    setC(false);
    setP(false);
  };
  const displayChangeD = e => {
    setShowD(!showD);
    setShowD2(false);
    setShowA(false);
    setP(false);
    setC(false);
    setShowP(false);
  };
  const displayChangeD2 = e => {
    setShowD2(!showD);
    setShowP(false);
    setShowD(false);
    setShowA(false);
    setC(false);
    setP(false);
  };
  const pidHandler = event => {
    setPid(event.target.value);
  };
  const delIdHandler = event => {
    setdId(event.target.value);
  };
  const dateHandler = event => {
    setDate(event.target.value);
  };
  const nameHandler = event => {
    setName(event.target.value);
  };
  const priceHandler = event => {
    setPrice(event.target.value);
  };

  const descHandler = event => {
    setDesc(event.target.value);
  };
  const uidHandler = event => {
    setUid(event.target.value);
  };
  const addressHandler = event => {
    setAdd(event.target.value);
  };
  const approvedHandler = event => {
    setApprove(event.target.value);
  };

  const emailHandler = event => {
    setEmail(event.target.value);
  };

  const getCust = () => {
    axios.get("http://localhost:3001/getCust").then(
      response => {
        response.data.forEach(item => {
          setCust(custs => custs.concat(item));
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  const logout = () => {
    axios.get("http://localhost:3001/logout");
    history.push("/");
  };
  if (user === "Not Found") {
    logout();
  }
  const res = async () => {
    await axios.get("http://localhost:3001/state").then(
      response => {
        setUser(response.data);
        return user;
      },
      error => {
        console.log(error);
      }
    );

    //console.log(user);
  };
  const approve = async val => {
    await axios.post("http://localhost:3001/approve", { val }).then(
      response => {
        refreshPage();
      },
      error => {
        console.log(error);
      }
    );
    console.log("test");
  };

  const priceChange = async (id, price) => {
    await axios.post("http://localhost:3001/priceChange", { id, price }).then(
      response => {
        if (response.data === "Not Found") {
          alert("Id was not found in database");
        }
        refreshPage();
      },
      error => {
        console.log(error);
      }
    );
    console.log("test");
  };

  const getProds = () => {
    axios.get("http://localhost:3001/getProds").then(
      response => {
        response.data.forEach(item => {
          setProd(prods => prods.concat(item));
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  const refreshPage = () => {
    window.location.reload();
  };
  let listItems = "Not logged in";
  if (user !== "undefined" || user !== "Not Found") {
    listItems = custs.map(item => {
      return (
        <ul id="citem">
          <li>UID: {item.uid}</li>
          <li>Name: {item.name}</li>
          <li>Email: {item.email}</li>
          <li>Address: {item.address}</li>
          <li>Approval: {item.approved.toString()}</li>
          <button type="submit" onClick={() => approve(item.uid)}>
            Approve/disapprove customer
          </button>
        </ul>
      );
    });
  }

  let products = "Not logged in";
  if (user !== "undefined" || user !== "Not Found") {
    products = prods.map(item => {
      return (
        <ul id="pitem">
          <li>PID: {item.pid}</li>
          <li>Name: {item.name}</li>
          <li>Price: {item.price}</li>
          <li>Description: {item.desc}</li>
          <li>Date Created: {item.date_created}</li>
        </ul>
      );
    });
  }

  const customers = (
    <div>
      <h1>Customers</h1>
      <div>{listItems}</div>
    </div>
  );
  useEffect(() => {
    res();
    getCust();
    getProds();
  }, []);
  // res();
  // getCust();

  const submitProd = () => {
    axios
      .post("http://localhost:3001/createProd", {
        pid,
        name,
        price,
        desc,
        date
      })
      .then(
        response => {
          if (response.data === "Exists") {
            alert("Product Id already exists in database");
          }
        },
        error => {
          console.log(error);
        }
      );
    refreshPage();
  };
  const submitCust = () => {
    axios
      .post("http://localhost:3001/createCust", {
        uid,
        name,
        email,
        address,
        capprove
      })
      .then(
        response => {
          if (response.data === "Exists") {
            alert("Customer Id already exists in database");
          }
        },
        error => {
          console.log(error);
        }
      );
    refreshPage();
  };
  const deleteItem = (type, id) => {
    axios
      .post("http://localhost:3001/deleteItem", {
        type,
        id
      })
      .then(
        response => {
          if (response.data === "Not Found") {
            alert("Given id does not exist in the Database");
          }
        },
        error => {
          console.log(error);
        }
      );
    refreshPage();
  };

  const page = (
    <div>
      {getCust}
      <div class="welcome">Welcome {user}</div>
    </div>
  );
  const changePrice = showP ? (
    <div>
      <label id="form">
        <div>
          Product id:
          <div>
            <input onChange={pidHandler}></input>
          </div>
        </div>
        <div>
          New price:
          <div>
            <input onChange={priceHandler}></input>
          </div>
        </div>
        <button onClick={() => priceChange(pid, price)}>Submit</button>
      </label>
    </div>
  ) : (
    <div></div>
  );

  const addProduct = createP ? (
    <div>
      <label id="form">
        <div>
          Product id:
          <div>
            <input onChange={pidHandler}></input>
          </div>
        </div>
        <div>
          Name:
          <div>
            <input onChange={nameHandler}></input>
          </div>
        </div>
        <div>
          Price:
          <div>
            <input onChange={priceHandler}></input>
          </div>
        </div>
        <div>
          Description:
          <div>
            <textarea
              id="w3review"
              name="w3review"
              rows="4"
              cols="50"
              onChange={descHandler}
            ></textarea>
          </div>
        </div>
        <div>
          Date:
          <div>
            <input onChange={dateHandler}></input>
          </div>
        </div>
        <button onClick={submitProd}>Submit</button>
      </label>
    </div>
  ) : (
    <div></div>
  );

  const addCust = createC ? (
    <div>
      <label id="form">
        <div>
          Customer id:
          <div>
            <input onChange={uidHandler}></input>
          </div>
        </div>
        <div>
          Name:
          <div>
            <input onChange={nameHandler}></input>
          </div>
        </div>
        <div>
          Email:
          <div>
            <input onChange={emailHandler}></input>
          </div>
        </div>
        <div>
          Address:
          <div>
            <input onChange={addressHandler}></input>
          </div>
        </div>
        <div>
          Approved:
          <div>
            <input
              type="radio"
              id="true"
              name="true"
              value="true"
              onChange={approvedHandler}
            />
            <label for="true">True</label>
            <input
              type="radio"
              id="false"
              name="false"
              value="false"
              onChange={approvedHandler}
            />
            <label for="false">False</label>
          </div>
        </div>
        <button onClick={() => submitCust()}>Submit</button>
      </label>
    </div>
  ) : (
    <div></div>
  );

  // <DellItemP idHandler={delIdHandler} id={delId}>
  // this.props.idHandler and thtis.props.id
  const delItemP = showD ? (
    <div>
      <label id="form">
        <div>
          Product id:
          <div>
            <input onChange={delIdHandler}></input>
          </div>
        </div>
        <button onClick={() => deleteItem("Product", delId)}>Submit</button>
      </label>
    </div>
  ) : (
    <div></div>
  );

  const delItemC = showD2 ? (
    <div>
      <label id="form">
        <div>
          Customer id:
          <div>
            <input onChange={delIdHandler}></input>
          </div>
        </div>
        <button onClick={() => deleteItem("c", delId)}>Submit</button>
      </label>
    </div>
  ) : (
    <div></div>
  );
  const productPage = (
    <div>
      <h1>Products</h1>
      <div>{products}</div>
    </div>
  );
  const modify = (
    <div>
      <div>
        <h1>Database</h1>
        <div class="dbitems">
          <div id="small">
            <button onClick={() => displayChangeP()}>Change price</button>
            {changePrice}
          </div>
          <div id="small">
            <button onClick={() => createProd()}>Add Product</button>
            {addProduct}
          </div>
          <div id="small">
            <button onClick={() => createCust()}>Add Customer</button>
            {addCust}
          </div>
          <div id="small">
            <button onClick={() => displayChangeD()}>Delete Product</button>
            {delItemP}
          </div>
          <div id="small">
            <button onClick={() => displayChangeD2()}>Delete Customer</button>
            {delItemC}
          </div>
          <div id="small">
            <button id="logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class="outer">
      <div class="header">{page}</div>
      <div class="app">
        <div class="customers">{customers}</div>
        <div class="products">{productPage}</div>
        <div class="modifyItems">{modify}</div>
      </div>
      <div class="footer"></div>
    </div>
  );
}

export default Home;
