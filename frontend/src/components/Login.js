import React from 'react';
import {Grid, Header, Segment, Form, Button} from 'semantic-ui-react';

function Login({user:{username, mobileNumber, verificationCode, verificationSent}, setUser, sendSmsCode}) {
    function populateFilds(event, data){
        setUser((draft) => {
            draft[data.name] = data.value;
        });
    }
    return <Grid textAlign='center' verticalAlign='middle' style={{height: '100vh' }}>
        <Grid.Column style={{maxWidht: 450 }}>
            <Header as='h2' color="teal" textAlign='center'>
                Login into Your Account:
            </Header>
            <form>
                <Segment stacked>
                    <Form.Input 
                        fluid
                        icon='user'
                        iconPosition='left'
                        placeHolder='UserName'
                        value={username}
                        onChange={(event, data)=> populateFilds(event, data)}
                        name='username'
                        />
                    <Form.Input 
                        fluid
                        icon='mobile alternate'
                        iconPosition='left'
                        placeHolder='Mobile Number'
                        value={mobileNumber}
                        onChange={(event, data)=> populateFilds(event, data)}
                        name='mobileNumber'
                        />
                    {verificationSent && (
                    <Form.Input
                        fluid
                        icon='key'
                        iconPosition='left'
                        placeHolder='Enter your code'
                        value={verificationCode}
                        onChange={(event, data) => populateFilds(event, data)}
                        name='verificationCode'
                        />
                    )}
                    <Button color="teal" fluid size="large" onClick={sendSmsCode}>
                        Login/Signup
                    </Button>
                </Segment>
            </form>
        </Grid.Column>
    </Grid>;
    }

export default Login;