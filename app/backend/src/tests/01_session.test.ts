import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

const sinon = require('sinon');

import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

import loginService from '../services/AuthService';
import { loginReturnMock, validateLoginReturnMock } from './mocks/login';
import { BadRequest, Unauthorized } from '../@types/errors';

describe('/login', () => {
  let chaiHttpResponse: Response;

  afterEach(() => sinon.restore());

  it('should response with token if credentials are correct', async () => {
    sinon.stub(loginService, 'login')
      .resolves(loginReturnMock)

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'secret_admin',
      });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.include.any.keys('token');
  });

  it('should response with a error if email aren\'t correct', async () => {
    sinon.stub(loginService, 'login')
      .throws(new Unauthorized('Incorrect email or password'))

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'patati@patata.com',
        password: 'secret_admin',
      });
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Incorrect email or password' });
  });

  it('should response with a error if password aren\'t correct', async () => {
    sinon.stub(loginService, 'login')
      .throws(new Unauthorized('Incorrect email or password'))

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'patatipatata',
      });
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Incorrect email or password' });
  });

  it('should response with a error if credentials weren\'t sent', async () => {
    sinon.stub(loginService, 'login')
      .throws(new BadRequest('All fields must be filled'))

    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({});
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' });
  });
});

describe('/login/validate', () => {
  let chaiHttpResponse: Response;

  afterEach(() => sinon.restore());

  it('should response with token if credentials are correct', async () => {
    sinon.stub(loginService, 'validateToken')
      .resolves(validateLoginReturnMock)

    const token = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'secret_admin',
      }).then((res) => res.body.token)

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', token);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.include.any.keys('role');
  });

  it('should response with a error if token aren\'t valid', async () => {
    sinon.stub(loginService, 'validateToken')
      .throws(new Unauthorized('Expired or invalid token'))

    const token = 'patatipatata'

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
      .set('authorization', token);
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Expired or invalid token' });
  });

  it('should response with a error if token doesn\'t exists', async () => {
    sinon.stub(loginService, 'validateToken')
      .throws(new Unauthorized('Token not found'))

    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate')
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token not found' });
  });
});
