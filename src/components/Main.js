import React from "react";

// components from atomize
import { Div, Row, Col, Button, Text, Textarea, Modal, Icon } from "atomize";

// axios for api calls
import axios from "axios";

function Main() {

  // some important variables for api calls
  const [no_list, setNo_list] = React.useState([]);
  const [res_list, setRes_list] = React.useState([]);
  const [user_list, setUser_list] = React.useState([]);
  const [com_list, setCom_list] = React.useState([]);

  // disabled variable to stop user input while api call
  const [disabled, setDisabled] = React.useState(false);

  // computer steps log
  const [log, setLog] = React.useState([]);

  // backend url
  const [domain] = React.useState("https://neukcodedemo.pythonanywhere.com/api");

  // win modals
  const [user_win_model, setUser_win_model] = React.useState(false);
  const [com_win_model, setCom_win_model] = React.useState(false);

  // log function
  const add_log = (msg) => {
    var temp_log = [msg, ...log];
    setLog(temp_log);
  }

  // reset button function
  const reset_fn = () => {
    setNo_list([]);
    setRes_list([]);
    setUser_list([]);
    setCom_list([]);
    setDisabled(false);
    setUser_win_model(false);
    setCom_win_model(false);
    setLog([]);
  };

  // computer will play first
  const com_start = () => {
    setDisabled(true);
    add_log('computer is thinking...');

    // api call
    axios
      .post(`${domain}/play/`, {
        no_list: no_list,
        res_list: res_list,
        user_list: user_list,
        com_list: com_list,
      })
      // get data
      .then((response) => {
        console.log("axios called");
        setNo_list(response.data.no_list);
        setRes_list(response.data.res_list);
        setUser_list(response.data.user_list);
        setCom_list(response.data.com_list);
        setDisabled(false);
        add_log(`Computer move => ${response.data.move}`);
      })
      // if error
      .catch((err) => {
        console.log("axios called");
        console.log(err);
        add_log('Computer is sleeping, try again to wake him up...');
      });
  };

  // computer play function
  const com_chance = (temp_user_list, temp_res_list) => {
    setDisabled(true);
    add_log("com is thinking");

    // api call
    axios
      .post(`${domain}/play/`, {
        no_list: no_list,
        res_list: temp_res_list,
        user_list: temp_user_list,
        com_list: com_list,
      })
      // get data
      .then((response) => {
        console.log("axios called");
        // if no one won
        if (response.data.user_win !== true && response.data.com_win !== true) {
          setDisabled(false);
          setNo_list(response.data.no_list);
          setRes_list(response.data.res_list);
          setUser_list(response.data.user_list);
          setCom_list(response.data.com_list);
          add_log(`Computer move => ${response.data.move}`);
        } else {
          // if computer won
          if (response.data.com_win === true) {
            setNo_list(response.data.no_list);
            setRes_list(response.data.res_list);
            setUser_list(response.data.user_list);
            setCom_list(response.data.com_list);
            setCom_win_model(true);
            add_log(`Computer move => ${response.data.move}`);
            add_log('computer won the match...');
          } else {
            // if user won
            if (response.data.user_win === true) {
              setUser_win_model(true);
              add_log('User won the match...');
            }
          }
        }
      })
      // if error
      .catch((err) => {
        console.log("axios called");
        console.log(err);
        add_log('Computer is sleeping, try again to wake him up...');
      });
  };

  // user play function
  const play = (id) => {

    // user list update
    var temp_user_list = [...user_list, id];
    setUser_list(temp_user_list);

    // res list update
    var temp_res_list = [...res_list, id];
    setRes_list(temp_res_list);

    add_log(`User move => ${id}`);

    // computer will play next
    com_chance(temp_user_list, temp_res_list);
  };

  React.useEffect(() => {
    // if no one played, computer will play first
    if (res_list.length === 0) {
      com_start();
    }

    // if all 9 boxes are filled
    if (res_list.length === 9) {
      add_log('Game Draw, play again...');
    }

    // to avoid warnings for not adding dependent variables (because they will cause unnecessary re-renders)
    // eslint-disable-next-line
  }, [res_list]);

  return (
    <Div
      p={{
        t: { xs: "4rem", md: "1rem" },
        l: { xs: "1rem", md: "25rem" },
        r: { xs: "1rem", md: "25rem" },
      }}
    >
      <Text tag="h1" textSize="title" textAlign="center" m={{ b: "1rem" }}>
        Tic Tac Toe
      </Text>

      {/* 1st row */}
      <Row>
        {[1, 2, 3].map((id) => (
          <Col key={id} size={4}>
            <Button
              disabled={res_list.includes(id) || disabled}
              bg="warning800"
              h={{ xs: "5rem", md: "7rem" }}
              w="100%"
              rounded="md"
              onClick={() => {
                play(id);
              }}
            >
              <Text
                textWeight="900"
                textColor="black"
                textSize="display3"
                textAlign="center"
              >
                {user_list.includes(id)
                  ? "X"
                  : com_list.includes(id)
                  ? "O"
                  : ""}
              </Text>
            </Button>
          </Col>
        ))}
      </Row>
      <br />

      {/* 2nd row */}
      <Row>
        {[4, 5, 6].map((id) => (
          <Col key={id} size={4}>
            <Button
              disabled={res_list.includes(id) || disabled}
              bg="warning800"
              h={{ xs: "5rem", md: "7rem" }}
              w="100%"
              rounded="md"
              onClick={() => {
                play(id);
              }}
            >
              <Text
                textWeight="900"
                textColor="black"
                textSize="display3"
                textAlign="center"
              >
                {user_list.includes(id)
                  ? "X"
                  : com_list.includes(id)
                  ? "O"
                  : ""}
              </Text>
            </Button>
          </Col>
        ))}
      </Row>
      <br />

      {/* 3rd row */}
      <Row>
        {[7, 8, 9].map((id) => (
          <Col key={id} size={4}>
            <Button
              disabled={res_list.includes(id) || disabled}
              bg="warning800"
              h={{ xs: "5rem", md: "7rem" }}
              w="100%"
              rounded="md"
              onClick={() => {
                play(id);
              }}
            >
              <Text
                textWeight="900"
                textColor="black"
                textSize="display3"
                textAlign="center"
              >
                {user_list.includes(id)
                  ? "X"
                  : com_list.includes(id)
                  ? "O"
                  : ""}
              </Text>
            </Button>
          </Col>
        ))}
      </Row>
      <br />

      {/* reset button */}
      <Row align="center" justify="center">
        <Button
          h="2rem"
          p={{ x: "0.75rem" }}
          textSize="caption"
          textColor="info700"
          hoverTextColor="info900"
          bg="white"
          hoverBg="info200"
          border="1px solid"
          borderColor="info700"
          hoverBorderColor="info900"
          m={{ r: "0.5rem" }}
          onClick={() => {
            reset_fn();
          }}
        >
          Reset
        </Button>
      </Row>
      <br />

      {/* log */}
      <Row>
        <Col size={12}>
          <Textarea
            placeholder="Progress Log ..."
            bg="black"
            textColor="white"
            value={log.join("\n")}
            cursor="not-allowed"
            h="12rem"
            disabled
          />
        </Col>
      </Row>
      <br />
      <br />

      {/* user win model */}
      <Modal
        isOpen={user_win_model}
        onClose={() => {
          setUser_win_model(false);
        }}
        align="center"
        rounded="md"
      >
        <Div d="flex" m={{ b: "4rem" }}>
          <Icon
            name="User"
            color="success700"
            m={{ t: "0.35rem", r: "0.5rem" }}
          />
          <Text p={{ l: "0.5rem", t: "0.25rem" }} textSize="subheader">
            Congratulation, you won the match...
          </Text>
        </Div>
        <Div d="flex" justify="center">
          <Button
            onClick={() => {
              setUser_win_model(false);
            }}
            bg="info700"
          >
            OK
          </Button>
        </Div>
      </Modal>

      {/* computer win model */}
      <Modal
        isOpen={com_win_model}
        onClose={() => {
          setCom_win_model(false);
        }}
        align="center"
        rounded="md"
      >
        <Div d="flex" m={{ b: "4rem" }}>
          <Icon
            name="User"
            color="danger700"
            m={{ t: "0.35rem", r: "0.5rem" }}
          />
          <Text p={{ l: "0.5rem", t: "0.25rem" }} textSize="subheader">
            You lost the match, better luck next time...
          </Text>
        </Div>
        <Div d="flex" justify="center">
          <Button
            onClick={() => {
              setCom_win_model(false);
            }}
            bg="info700"
          >
            OK
          </Button>
        </Div>
      </Modal>
    </Div>
  );
}

export default Main;


// at last ended this 😌