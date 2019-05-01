import React from 'react';
import Modal from 'react-modal';
import Layout from '../Layout';

export default function PageModal({ isOpen, children }) {
  return (
    <Modal
      isOpen={isOpen}
      overlayClassName="modal-backdrop"
      className="modal modal--full-page"
      bodyOpenClassName="modal-open"
    >
      <Layout>{children}</Layout>
    </Modal>
  );
}
