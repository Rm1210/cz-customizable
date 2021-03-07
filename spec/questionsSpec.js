'use strict';

describe('cz-customizable', function() {

  var questions, config;

  beforeEach(function() {
    questions = require('../questions.js');
    config = null;
  });

  var mockedCz = {
    Separator: jasmine.createSpy()
  };

  var getQuestion = function(number) {
    return questions.getQuestions(config, mockedCz)[number - 1];
  };

  it('should array of questions be returned', function() {
    config = {
      types: [{value: 'feat', name: 'feat: my feat'}],
      scopes: [{name: 'myScope'}],
      scopeOverrides: {
        fix: [{name: 'fixOverride'}]
      },
      allowCustomScopes: true
    };

    // question 1 - TYPE
    expect(getQuestion(1).name).toEqual('type');
    expect(getQuestion(1).type).toEqual('list');
    expect(getQuestion(1).choices[0]).toEqual({value: 'feat', name: 'feat: my feat'});

    // question 2 - SCOPE
    expect(getQuestion(2).name).toEqual('scope');
    expect(getQuestion(2).choices({})[0]).toEqual({name: 'myScope'});
    expect(getQuestion(2).choices({type: 'fix'})[0]).toEqual({name: 'fixOverride'}); //should override scope
    expect(getQuestion(2).when({type: 'fix'})).toEqual(true);

    // question 3 - SCOPE CUSTOM
    expect(getQuestion(3).name).toEqual('scope');
    expect(getQuestion(3).when({scope: 'custom'})).toEqual(true);
    expect(getQuestion(3).when({scope: false})).toEqual(false);
    expect(getQuestion(3).when({scope: 'scope'})).toEqual(false);

    // question 4 - SUBJECT
    expect(getQuestion(4).name).toEqual('subject');
    expect(getQuestion(4).type).toEqual('input');
    expect(getQuestion(4).message).toMatch(/IMPERATIVE tense description/);
    expect(getQuestion(4).validate()).toEqual(false); //mandatory question
    expect(getQuestion(4).filter('Subject')).toEqual('subject');

    // question 5 - BODY
    // expect(getQuestion(5).name).toEqual('body');
    // expect(getQuestion(5).type).toEqual('input');

    //question 6, last one, CONFIRM COMMIT OR NOT
    expect(getQuestion(5).name).toEqual('confirmCommit');
    expect(getQuestion(5).type).toEqual('expand');


    var answers = {
      confirmCommit: 'yes',
      type: 'feat',
      scope: 'myScope',
      subject: 'create a new cool feature'
    };
    expect(getQuestion(6).message(answers)).toMatch('Are you sure you want to proceed with the commit above?');
  });

  describe('Optional scopes', function() {

    it('should use scope override', function() {
      config = {
        types: [{value: 'feat', name: 'feat: my feat'}],
        scopeOverrides: {
          feat: [{name: 'myScope'}]
        }
      };

      // question 2 with
      expect(getQuestion(2).name).toEqual('scope');
      expect(getQuestion(2).choices({})[0]).toBeUndefined();
      expect(getQuestion(2).choices({type: 'feat'})[0]).toEqual({name: 'myScope'}); //should override scope
      expect(getQuestion(2).when({type: 'feat'})).toEqual(true);
      (function () {
        var answers = {type: 'fix'};
        expect(getQuestion(2).when(answers)).toEqual(false);
        expect(answers.scope).toEqual('custom');
      })();

    });
  });


});
