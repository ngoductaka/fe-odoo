import React, { useState, useEffect } from "react";
import { useSelector, connect, useDispatch } from "react-redux";
import { Form, Input, Button, Checkbox, Image, Row, notification } from "antd";
import { useHistory } from 'react-router-dom';

import { useTranslation, initReactI18next } from "react-i18next";

// import { handleClearAllData, requestSignIn } from "./actions";
import { get } from "lodash";

import { images } from "../../helper/static/images";
import { requestLogin, isLoginSelector } from "../../app_state/login";
import { ROUTES } from "../../_config/route";
import { LanguageIcon } from "com/app_layout/general_header/right_item_bar";
const login = "login";
const { logo, bg } = images;

const SignInPage = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { userrole } = useSelector(state => state.app)
    const { t, i18n } = useTranslation();


    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        try {

            const body = { username, password: pwd };
            setLoading(true);
            const result = await dispatch(requestLogin(body));
            setLoading(false);
            if (result) {
                // console.log('resul222t', result);
                history.push(result?.userrole == 3 ? `/${ROUTES.Monitor}` : `/${ROUTES.HOME}`)
            }
        } catch (err) {

            setLoading(false);
        }
    };

    return (
        <div
            className="h-screen w-screen flex"
        >
            <div className="flex-1 flex center items-center justify-center" style={{ background: '#3A5BB8' }}>
                <div className="flex-col flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">관리 솔루션 및 생산</span>
                    <img src={images.loginBg} className="" />
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
                <div>
                    <div className="flex justify-center items-center mt-20">
                        <img src={images.anyone_logo} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold mt-10">로그인</p>
                        <p className="text-base -mt-4">시스템에 액세스하려면 로그인하십시오.</p>
                    </div>

                    <div>
                        <div>
                            <div style={{ marginTop: 60 }}>
                                <div style={{ width: 130, zIndex: 3, fontSize: 16 }}>계정</div>
                                <Input
                                    placeholder={'계정을 입력하세요'}
                                    style={{ width: 400 }}
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                            onLogin()
                                        }
                                    }}
                                />
                                <span style={{ width: 130 }}></span>
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <div style={{ width: 130, zIndex: 3, fontSize: 16 }}>{'비밀번호'}</div>
                                <Input.Password
                                    placeholder={'비밀번호를 입력하세요'}
                                    style={{ width: 400 }}
                                    value={pwd}
                                    onChange={e => setPwd(e.target.value)}
                                    onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                            onLogin()
                                        }
                                    }}
                                />
                                <span style={{ width: 130 }}></span>
                            </div>
                            <Button 
                            loading={loading}
onClick={onLogin}
                            className="text-white mt-5 w-full" style={{background: '#3A5BB8', color: '#fff'}}>비밀번호를 입력하세요</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;

// <span
// style={{
//     zIndex: 3,
//     fontSize: 28,
//     color: "#fff",
//     fontWeight: "bold",
//     // marginTop: 10,
// }}
// >

// {/* {t(`${login}.title_header`)} */}
// {/* {Asset performance management} */}
// </span>
// <span style={{ zIndex: 3, fontSize: 26, color: "#fff" }}>
// {t(`${login}.sub_header`)}
// </span>
// <div>
// <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginTop: 40 }}>
//     <div style={{ width: 130, zIndex: 3, color: '#eee', fontSize: 16 }}>{t(`${login}.acc_name`)}</div>
//     <Input
//         placeholder={t(`${login}.acc_name`)}
//         style={{ width: 200 }}
//         value={username}
//         onChange={e => setUsername(e.target.value)}
//         onKeyPress={event => {
//             if (event.key === 'Enter') {
//                 onLogin()
//             }
//         }}
//     />
//     <span style={{ width: 130 }}></span>
// </div>
// <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginTop: 20 }}>
//     <div style={{ width: 130, zIndex: 3, color: '#eee', fontSize: 16 }}>{t(`${login}.pass`)}</div>
//     <Input.Password
//         placeholder={t(`${login}.pass`)}
//         style={{ width: 200 }}
//         value={pwd}
//         onChange={e => setPwd(e.target.value)}
//         onKeyPress={event => {
//             if (event.key === 'Enter') {
//                 onLogin()
//             }
//         }}
//     />
//     <span style={{ width: 130 }}></span>
// </div>
// </div>
// <Button
// loading={loading}
// onClick={onLogin}
// style={{ alignSelf: 'center', marginTop: 20, width: 130 }}>{t(`${login}.login`)}</Button>
// <div style={{position: 'fixed', bottom: 10, right: 20}}>
// <LanguageIcon />
// </div>