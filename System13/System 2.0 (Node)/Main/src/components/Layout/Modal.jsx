import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../context/modalSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { AnimatePresence } from "framer-motion";

const Modal = (props) => {
  const isOpen = useSelector((state) => state.modal.isOpen);
  const info = useSelector((state) => state.modal.info);
  const dispatch = useDispatch();
  const overlayRef = useRef(null);

  return (
    <>
      {!isOpen && props.children}
      <motion.div
        ref={overlayRef}
        className="backdrop"
        initial={{ opacity: 0, zIndex: -100 }}
        animate={
          isOpen ? { opacity: 1, zIndex: 5 } : { opacity: 0, zIndex: -100 }
        }
        transition={{ type: "tween", duration: 0.5 }}
      >
        {props.children}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
            className="modal"
            initial={{ opacity: 0, y: 60, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 300 },
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.1 } }}
          >
            <div
              className="modal__header"
              style={{ backgroundColor: "#fa4454" }}
            >
              <i className={info.icon}></i>
              <h1>{info.header}</h1>
            </div>
            <p>{info.text}</p>
            {info.button && (
              <button
                className="btn"
                onClick={() => {
                  dispatch(modalActions.close());
                }}
              >
                {info.button}
              </button>
            )}
            {info.navlink.to && (
              <Link
                className="btn modal__link"
                to={info.navlink.to}
                onClick={() => {
                  dispatch(modalActions.close());
                }}
              >
                <p>{info.navlink.text}</p>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
