/**
 * Created by Joey Chan on July 13, 2017.
 */

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { MetadataForm, MFMultiple, MFElement } from '../object/metadata-form/MetadataForm';
import { MDDefinition } from '../object/metadata/MDDefinition';
import { OutgoingMetadataInstance, OMIElement } from '../object/metadata-form/OutgoingMetadataInstance';
import { MDElement } from '../object/metadata/MDElement';
import { MDElementParser } from '../parser/md-element.parser';
import '../object/Array'; // TODO: move this somewhere more global?

@Injectable()
export class MetadataFormParser {

  static parseToOutgoing(rawForm: MetadataForm, rawDefinition: MDDefinition): OutgoingMetadataInstance {
    const outgoing: OutgoingMetadataInstance = {
      general: {
        dataset: rawDefinition.dataset.replace('/definition-xml-2.0', '/instance-xml-2.0'),
        parent: rawDefinition.id
      },
      identification: {
        reason_for_change: 'Updated through Pegasus - ' + rawForm.reasonForChange.value,
        created_by: 'dms', // TODO: change to current user
        effective_start: this.parseDate(rawForm.effectiveStart.value, rawForm.effectiveStart.timeTemp)
        // active_flag: true
      },
      elements: this.setElements(rawForm.elements, rawDefinition.elements)
    };

    // add optional values
    if (rawForm.effectiveEnd.value !== '') {
      outgoing.identification.effective_end = this.parseDate(rawForm.effectiveEnd.value,
        rawForm.effectiveEnd.timeTemp);
    }

    return outgoing;
  }

  private static parseElements(value: MFMultiple, element: MDElement): OMIElement {

    if (value.valueGroup.value === '' && element.format !== 'string') { return null; }
    if (element.format === 'date') {
      value.valueGroup.value = this.parseDate(value.valueGroup.value,
      value.valueGroup.timeTemp);
    }
    const outgoingElement: OMIElement = {
      element_group: element.group,
      element_name: element.name,
      element_uom: element.uom,
      element_value: value.valueGroup.value,
      elements: this.setElements(value.elements, element.elements)
      // TODO: language_values
    };

    return outgoingElement;
  }

  private static parseDate(dateValue: string, timeValue: string): string {
    if (dateValue == null) {
      return null;
    }
    if (timeValue === '' || timeValue == null) {
        timeValue = 'T00:00:00.000Z';
    } else {
      timeValue = 'T'.concat(timeValue).concat('Z');
    }
    return (new Date(dateValue)).toISOString().substring(0, 10).concat(timeValue);
  }

  private static setElements(form: MFElement[], definition: MDElement[]): OMIElement[] {

    const outgoingElements = form.map(e => {
      return e.multiple.map(m => {
        const elementDefinition = definition.find(ele => ele.id === m.definitionID);
        return this.parseElements(m, elementDefinition);
      });
    });

    return outgoingElements
      .flatten()
      .filter(each => each != null);
  }
}
