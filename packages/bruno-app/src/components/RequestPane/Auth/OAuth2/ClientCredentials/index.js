import React from 'react';
import get from 'lodash/get';
import { useTheme } from 'providers/Theme';
import { useDispatch } from 'react-redux';
import SingleLineEditor from 'components/SingleLineEditor';
import { updateAuth } from 'providers/ReduxStore/slices/collections';
import { saveRequest, sendRequest } from 'providers/ReduxStore/slices/collections/actions';
import StyledWrapper from './StyledWrapper';
import { inputsConfig } from './inputsConfig';

const OAuth2ClientCredentials = ({ item, collection }) => {
  const dispatch = useDispatch();
  const { storedTheme } = useTheme();

  const oAuth = item.draft ? get(item, 'draft.request.auth.oauth2', {}) : get(item, 'request.auth.oauth2', {});

  const handleRun = async () => {
    dispatch(sendRequest(item, collection.uid));
  };

  const handleSave = () => dispatch(saveRequest(item.uid, collection.uid));

  const { accessTokenUrl, clientId, clientSecret, scope, basicAuth } = oAuth;

  const handleChange = (key, value) => {
    dispatch(
      updateAuth({
        mode: 'oauth2',
        collectionUid: collection.uid,
        itemUid: item.uid,
        content: {
          grantType: 'client_credentials',
          accessTokenUrl,
          clientId,
          clientSecret,
          scope,
          basicAuth,
          [key]: value
        }
      })
    );
  };

  const handleBasicAuthToggle = (e) => {
    dispatch(
      updateAuth({
        mode: 'oauth2',
        collectionUid: collection.uid,
        itemUid: item.uid,
        content: {
          grantType: 'client_credentials',
          accessTokenUrl,
          clientId,
          clientSecret,
          scope,
          basicAuth: !Boolean(oAuth?.['basicAuth'])
        }
      })
    );
  };

  return (
    <StyledWrapper className="mt-2 flex w-full gap-4 flex-col">
      {inputsConfig.map((input) => {
        const { key, label, isSecret } = input;
        return (
          <div className="flex flex-col w-full gap-1" key={`input-${key}`}>
            <label className="block font-medium">{label}</label>
            <div className="single-line-editor-wrapper">
              <SingleLineEditor
                value={oAuth[key] || ''}
                theme={storedTheme}
                onSave={handleSave}
                onChange={(val) => handleChange(key, val)}
                onRun={handleRun}
                collection={collection}
                item={item}
                isSecret={isSecret}
              />
            </div>
          </div>
        );
      })}
      <div className="flex flex-row w-full gap-4" key="basicAuth">
        <label className="block font-medium">Add Credentials as Basic Auth</label>
        <input
          className="cursor-pointer"
          type="checkbox"
          checked={Boolean(oAuth?.['basicAuth'])}
          onChange={handleBasicAuthToggle}
        />
      </div>
      <button onClick={handleRun} className="submit btn btn-sm btn-secondary w-fit">
        Get Access Token
      </button>
    </StyledWrapper>
  );
};

export default OAuth2ClientCredentials;
