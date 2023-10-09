import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import { Card } from 'react-bootstrap';

const Profile = () => {
  const { user, loading } = useSelector((state) => state.userr);

  // Define a placeholder URL for the default profile picture
  const defaultAvatarUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg'; // Replace with a valid image URL

  // Define the maximum dimensions for the avatar
  const maxAvatarWidth = '100px';
  const maxAvatarHeight = '100px';

  return (
    <Fragment>
      <MetaData title={'Your Profile'} />

      <h2 className="mt-5 ml-5">My Profile</h2>
      <div className="row justify-content-around mt-5 user-info">
        <div className="col-12 col-md-6">
          <Card>
            <Card.Body>
              <div className="text-center">
                {/* Use a conditional check to display user avatar or default picture */}
                {user && user.UserDoc && user.UserDoc.avatar ? (
                  <img
                    className="rounded-circle img-fluid"
                    src={user.UserDoc.avatar.url}
                    alt={user.UserDoc.firstname}
                    style={{ maxWidth: maxAvatarWidth, maxHeight: maxAvatarHeight }} // Add style here
                  />
                ) : (
                  <img
                    className="rounded-circle img-fluid"
                    src={defaultAvatarUrl}
                    alt="Default Profile"
                    style={{ maxWidth: maxAvatarWidth, maxHeight: maxAvatarHeight }} // Add style here
                  />
                )}
              </div>
              <h4 className="text-center mt-3">Full Name</h4>
              <p className="text-center">{user && user.UserDoc && user.UserDoc.firstname}</p>

              <h4 className="text-center">Email Address</h4>
              <p className="text-center">{user && user.UserDoc && user.UserDoc.email}</p>

              <h4 className="text-center">Joined On</h4>
              <p className="text-center">
                {user && user.UserDoc && String(user.UserDoc.createdAt).substring(0, 10)}
              </p>

              {user && user.UserDoc && user.UserDoc.role !== 'admin' && (
                <Link to="/bookings" className="btn btn-danger btn-block mt-4">
                  My Orders
                </Link>
              )}

              <Link to="/password/update" className="btn btn-primary btn-block mt-3">
                Change Password
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
