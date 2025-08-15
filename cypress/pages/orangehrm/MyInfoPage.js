
import s from '../../selectors/orangehrm/myinfo.sel';

// ===== Helpers =====
const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const makeLabelRegex = (label) =>
  new RegExp(
    '^' +
      String(label)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/['’]/g, "['’]")
        .replace(/[_\s]+/g, '[ _]?') +
      '$',
    'i'
  );


const clickScopedSave = ($scope) => {
  const scope = cy.wrap($scope);


  return scope.find('.oxd-form-actions button[type="submit"]').then(($btn) => {
    if ($btn.length) {
      return cy.wrap($btn).filter(':visible').first()
        .scrollIntoView()
        .should('not.be.disabled')
        .click({ force: true });
    }
    return scope.contains('button', /^\s*(Save|Guardar)\s*$/i)
      .filter(':visible')
      .first()
      .scrollIntoView()
      .click({ force: true });
  });
};

export default class MyInfoPage {
  // ===== Navegación por MyInfo
  assertOnPersonalDetails() {
    cy.location('pathname', { timeout: 10000 })
      .should('include', '/pim/viewPersonalDetails');

    cy.get(s.content).within(() => {
      cy.contains('h6', /\bPersonal Details\b/i, { timeout: 10000 })
        .should('be.visible');
    });
  }

  getHeaderEl() {
    return cy.get(s.content)
      .contains('h6', /\bPersonal Details\b/i, { timeout: 10000 });
  }
  getHeaderText() { return this.getHeaderEl().invoke('text'); }

  // ===== Helpers por label =====
  byLabelGroup(labelText) {
    return cy.contains('label', makeLabelRegex(labelText))
             .parents('div.oxd-input-group').first();
  }
  byLabelInput(labelText) {
    return this.byLabelGroup(labelText).find('input, textarea').first();
  }

  openDropdown(labelText) {
    this.byLabelGroup(labelText).find('div.oxd-select-text').click({ force: true });
    return cy.get('div[role="listbox"], .oxd-select-dropdown', { timeout: 10000 })
             .should('be.visible')
             .should(($box) => {
               const count = $box.find('[role="option"], .oxd-select-option').length;
               expect(count, 'opciones visibles').to.be.greaterThan(0);
             });
  }
  chooseOptionFromOpenList(optionText) {
    const rx = new RegExp(`^${escapeRegExp(String(optionText).trim())}$`, 'i');
    cy.get('div[role="listbox"], .oxd-select-dropdown', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains('[role="option"], .oxd-select-option', rx, { timeout: 10000 })
          .click({ force: true });
      });
  }
  selectFromDropdown(labelText, optionText) {
    this.openDropdown(labelText);
    this.chooseOptionFromOpenList(optionText);
  }

  selectFirstFromDropdown(labelText) {
    this.openDropdown(labelText);
    cy.get('div[role="listbox"], .oxd-select-dropdown', { timeout: 10000 })
      .should('be.visible')
      .find('[role="option"], .oxd-select-option')
      .should('have.length.greaterThan', 0)
      .first()
      .click({ force: true });
  }
  selectFirstNationality()   { this.selectFirstFromDropdown('Nationality'); }
  selectFirstMaritalStatus() { this.selectFirstFromDropdown('Marital Status'); }

  // ===== Seleccionar y rellenar: Personal Details
  setEmployeeFullName({ first = 'QA', middle = 'Auto', last = 'Tester' } = {}) {
    cy.get('input[name="firstName"]').clear().type(first);
    cy.get('input[name="middleName"]').clear().type(middle);
    cy.get('input[name="lastName"]').clear().type(last);
  }
  setEmployeeId(v)       { this.byLabelInput('Employee Id').clear().type(v); }
  setOtherId(v)          { this.byLabelInput('Other Id').clear().type(v); }
  setDriversLicense(v)   { this.byLabelInput("Driver's License Number").clear().type(v); }
  setLicenseExpiry(v)    { this.byLabelInput('License Expiry Date').clear().type(v).blur(); }

  selectNationality(v)   { v ? this.selectFromDropdown('Nationality', v) : this.selectFirstNationality(); }
  selectMaritalStatus(v) { v ? this.selectFromDropdown('Marital Status', v) : this.selectFirstMaritalStatus(); }

  setBirthDate(v)        { this.byLabelInput('Date of Birth').clear().type(v).blur(); }
  setGender(v = 'Male')  { cy.contains('label', makeLabelRegex(v)).click({ force: true }); }

  fillPersonalDetails({
    first, middle, last,
    employeeId, otherId, driversLicense,
    licenseExpiry, nationality, maritalStatus,
    birthDate, gender
  }) {
    this.setEmployeeFullName({ first, middle, last });
    if (employeeId)     this.setEmployeeId(employeeId);
    if (otherId)        this.setOtherId(otherId);
    if (driversLicense) this.setDriversLicense(driversLicense);
    if (licenseExpiry)  this.setLicenseExpiry(licenseExpiry);
    this.selectNationality(nationality);
    this.selectMaritalStatus(maritalStatus);
    if (birthDate)      this.setBirthDate(birthDate);
    if (gender)         this.setGender(gender);
  }

  // ===== Guardar Personal Details =====
  saveFirstVisible() {
    cy.intercept('PUT', /\/api\/v2\/pim\/employees\/\d+\/personal-details/).as('savePersonal');
    cy.get(s.saveBtn).filter(':visible').first().click({ force: true });
    cy.wait('@savePersonal').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.contains(s.toast, 'Success', { timeout: 10000 }).should('be.visible');
  }

  // ===== Custom Fields =====
  getCustomFieldsCard() {
    return cy
      .contains('h6', /\bCustom Fields\b/i, { timeout: 10000 })
      .should('be.visible')
      .closest('.orangehrm-card-container, .orangehrm-horizontal-padding, .oxd-card');
  }
  setBloodType(option) {
    this.getCustomFieldsCard().within(() => {
      this.selectFromDropdown('Blood Type', option);
    });
  }
  setTestField(value) {
    this.getCustomFieldsCard().within(() => {
      this.byLabelInput('Test_Field').should('be.visible').clear().type(value);
    });
  }
  saveCustomFields() {
    this.getCustomFieldsCard().then(($card) => clickScopedSave($card));
    cy.contains(s.toast, 'Success', { timeout: 15000 }).should('be.visible');
  }

  // ===== Scroll helper =====
  scrollToSection(title) {
    cy.contains('h6', new RegExp(`\\b${escapeRegExp(title)}\\b`, 'i'), { timeout: 15000 })
      .scrollIntoView()
      .should('be.visible');
  }

  goToCustomFields() {
  this.getCustomFieldsCard()
    .scrollIntoView()
    .should('be.visible')
    .within(() => {
      cy.contains('label', /Blood Type/i, { timeout: 10000 }).should('be.visible');
    });
}

  // ===== Attachments =====

  getAttachmentsAddButton() {
    return cy.get('body').then(($b) => {
      const hdr = $b.find('.orangehrm-action-header').toArray()
        .find((h) => /\bAdd\b/i.test(h.innerText));
      if (hdr) {
        const btn = Cypress.$(hdr).find('button').toArray()
          .find((b) => /\bAdd\b/i.test(b.innerText));
        if (btn) return cy.wrap(btn);
      }
      const btnByText = $b.find('button').toArray().find((b) => /\bAdd\b/i.test(b.innerText));
      if (btnByText) return cy.wrap(btnByText);
      const btnByIcon = $b.find('.orangehrm-action-header .bi-plus').closest('button').get(0);
      if (btnByIcon) return cy.wrap(btnByIcon);
      return cy.wrap(Cypress.$([]));
    });
  }

  getAttachmentsSection() {
    cy.scrollTo('bottom');
    return cy.get('body').then(($b) => {
      const $byLabel = $b.find('label').filter((_, el) => /^Select[ _]?File$/i.test(el.innerText)).first();
      if ($byLabel.length) {
        return cy.wrap($byLabel)
          .parents('.orangehrm-horizontal-padding, .orangehrm-card-container, .oxd-card')
          .first();
      }
      const $fileDiv = $b.find('.oxd-file-div').first();
      if ($fileDiv.length) {
        return cy.wrap($fileDiv)
          .parents('.orangehrm-horizontal-padding, .orangehrm-card-container, .oxd-card')
          .first();
      }
      const $addBtn = $b.find('.orangehrm-action-header button').toArray()
        .find((b) => /\bAdd\b/i.test(b.innerText)) || $b.find('.orangehrm-action-header .bi-plus').closest('button').get(0);
      if ($addBtn) {
        return cy.wrap($addBtn)
          .parents('.orangehrm-horizontal-padding, .orangehrm-card-container, .oxd-card')
          .first();
      }
      const $h6 = $b.find('h6').toArray().find((h) => /Attachments/i.test(h.innerText));
      if ($h6) {
        return cy.wrap($h6).closest('.orangehrm-horizontal-padding, .orangehrm-card-container, .oxd-card');
      }
      return cy.wrap($b[0]);
    });
  }
  getAttachmentsCard() { return this.getAttachmentsSection(); }

  goToAttachments() {
    cy.scrollTo('bottom');
    return this.getAttachmentsSection().scrollIntoView().should('exist');
  }

  getAddAttachmentCard() {
    return cy
      .contains('h6', /^\s*Add Attachment\s*$/i, { timeout: 10000 })
      .should('be.visible')
      .closest('.orangehrm-card-container');
  }

  addAttachment(filePathOrObject, comment = '') {
    this.goToAttachments();

    cy.get('body').then(($b) => {
      const hasAddCard = $b.find('h6').toArray().some((h) => /Add Attachment/i.test(h.innerText));
      const hasInlineUploader =
        $b.find('label').toArray().some((l) => /^Select[ _]?File$/i.test(l.innerText)) ||
        $b.find('.oxd-file-div').length > 0;

      if (!hasAddCard && !hasInlineUploader) {
        const addByText = $b.find('.orangehrm-action-header button').toArray()
          .find((b) => /\bAdd\b/i.test(b.innerText));
        if (addByText) return cy.wrap(addByText).click({ force: true });
        const addByIcon = $b.find('.orangehrm-action-header .bi-plus').closest('button').get(0);
        if (addByIcon) return cy.wrap(addByIcon).click({ force: true });
      }
    });


    this.getAddAttachmentCard().within(() => {
      cy.get('input[type="file"]', { timeout: 10000 })
        .first()
        .should('exist')
        .selectFile(filePathOrObject, { force: true });

      if (comment) {
        cy.contains('label', /^\s*Comment\s*$/i)
          .parents('.oxd-input-group').first()
          .find('textarea, input[type="text"]').first()
          .clear().type(comment);
      }

      cy.get('.oxd-form-actions', { timeout: 10000 }).within(() => {
        cy.get('button[type="submit"]')
          .filter(':visible')
          .first()
          .scrollIntoView()
          .should('not.be.disabled')
          .click({ force: true });
      });
    });

    // Toast de éxito
    cy.contains(s.toast, 'Success', { timeout: 15000 }).should('be.visible');
  }


  getAttachmentRowByComment(comment) {
    const rx = new RegExp(escapeRegExp(String(comment).trim()), 'i');
    return cy.contains('.oxd-table-card, .oxd-table-row', rx, { timeout: 15000 })
             .should('be.visible');
  }

  editAttachmentComment(oldComment, newComment) {
  this.goToAttachments();

  const rx = new RegExp(escapeRegExp(String(oldComment).trim()), 'i');

  cy.contains('.oxd-table-card, .oxd-table-row', rx, { timeout: 15000 }).as('row');

  cy.get('@row')
    .find('i.bi-pencil-fill, i.bi-pencil')    
    .first()
    .parents('button')
    .click({ force: true });

  cy.wait(50); 

  cy.get('body').then($b => {
    const $modal = $b.find('.oxd-dialog-container-default, .oxd-dialog-container-default--inner');

    if ($modal.length) {

      cy.wrap($modal).within(() => {
        cy.get('textarea, input[type="text"]', { timeout: 10000 })
          .first()
          .clear()
          .type(newComment);
      });
      cy.get('.oxd-dialog-container-default, .oxd-dialog-container-default--inner')
        .then($m => clickScopedSave($m));
    } else {

      this.getAttachmentsSection().then($sec => {
        const $form = $sec.find('form.oxd-form');

        if ($form.length) {

          cy.wrap($form.first()).as('inlineForm');

          cy.get('@inlineForm').within(() => {
            cy.contains('label', /Comment/i)
              .parents('.oxd-input-group').first()
              .find('textarea, input[type="text"]').first()
              .then($inp => {
                if ($inp.length) {
                  cy.wrap($inp).clear().type(newComment);
                } else {
                  cy.get('textarea:visible, input[type="text"]:visible').first().clear().type(newComment);
                }
              });
          });

          cy.get('@inlineForm').then($f => clickScopedSave($f));
        } else {
          cy.wrap($sec)
            .find('textarea:visible, input[type="text"]:visible', { timeout: 10000 })
            .first()
            .clear()
            .type(newComment);

          clickScopedSave($sec);
        }
      });
    }
  });

  cy.contains(s.toast, 'Success', { timeout: 15000 }).should('be.visible');
}

  downloadAttachmentByComment(comment) {
  this.goToAttachments();

  const rx = new RegExp(escapeRegExp(String(comment).trim()), 'i');

  cy.contains('.oxd-table-card, .oxd-table-row', rx, { timeout: 15000 }).as('row');

  cy.get('@row')
    .find('i.bi-download')
    .first()
    .parents('button,a')
    .first()
    .scrollIntoView()
    .click({ force: true });

  cy.wait(300);
}

  deleteAttachmentByComment(comment) {
    this.goToAttachments();

    const rx = new RegExp(escapeRegExp(String(comment).trim()), 'i');
    cy.contains('.oxd-table-card, .oxd-table-row', rx, { timeout: 15000 }).as('row');

    cy.get('@row')
      .find('i.bi-trash').first()
      .parents('button').click({ force: true });

    cy.contains('.oxd-dialog-container-default, .oxd-dialog-container-default--inner', /Are you Sure/i)
      .should('be.visible')
      .within(() => {
        cy.contains('button', /Yes, Delete/i).click({ force: true });
      });

    cy.contains(s.toast, 'Success', { timeout: 15000 }).should('be.visible');

    cy.contains('.oxd-table-card, .oxd-table-row', rx).should('not.exist');
  }
}